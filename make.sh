#!/bin/bash

# TODO raname build stage, maybe split to build and run stages
usage() {
    cat << USAGE >&2
Usage:
    TODO
USAGE
}

PREVIOD_USER_LOC=$(pwd)
PROJECT_DIR="$(dirname $(realpath $0))"
DOCKER_DIR="$PROJECT_DIR/docker";
cd $DOCKER_DIR

COMM_PD="docker-compose --project-directory $PROJECT_DIR "

# defualt behaviour => dettached production built
STAGES='prune build'
TARGET='prod'

while [[ $# -gt 0 ]]; do
    case $1 in 
        -s|--stages)
            STAGES=$(echo $2 | tr ',' ' ')
            shift 2;
            ;;
        -t|--target)
            TARGET=$2
            shift 2;
            ;;
        -S|--service)
            SERVICES="$SERVICES $(echo $2 | tr ',' ' ')"
            shift 2;
            ;;
        -m|--mock)
            MOCK_DB=true;
            shift 1;
            ;;
        -f|--follow)
            FOLLOW=true
            shift 1;
            ;;
        -p|--prune)
            PRUNE_AT_THE_END=true
            shift 1;
            ;;
        -a|--attach)
            ATTACH_TO_APP=true;
            shift 1;
            ;;
        -F|--dump-file)
            DUMP_FILE=$2
            shift 2;
            ;;
        *)
            OTHER_OPTS="$OTHER_OPTS $1"
            shift 1;
            ;;
    esac
done

MOCK_DB=${MOCK_DB:-false}
export MOCK_DB;

follow() {
    cd $DOCKER_DIR
    $COMM_PD logs --follow $OTHER_OPTS
    cd -
}

build() {
    mkdir -p $PROJECT_DIR/security
    ORDER=$1
    case $TARGET in 
        dev)
            $COMM_PD \
                -f docker-compose.yml \
                -f docker-compose-dev.yml \
                -f docker-compose-dev-expose.yml \
                $ORDER $OTHER_OPTS $SERVICES
            if [ "$ATTACH_TO_APP" = 'true' ]; then
                docker attach rct_application
            fi
        ;;

        prod)
            $COMM_PD \
                -f docker-compose.yml \
                -f docker-compose-prod.yml \
                -f docker-compose-expose.yml \
                $ORDER $OTHER_OPTS $SERVICES
        ;;

        test)
            mkdir -p $PROJECT_DIR/reports;
            $COMM_PD \
                -f docker-compose.yml \
                -f docker-compose-test.yml \
                up --build --abort-on-container-exit $OTHER_OPTS
        ;;
        *)
            echo "incorrect build target: $TARGET"
            usage
            exit 1;
            ;;
    esac

    if [ "$TARGET" != 'test' ] && [ "$FOLLOW" = 'true' ]; then
        follow
    fi
}


for stage in $STAGES; do
    echo " *** do $stage"
    case $stage in
        prune)
            $COMM_PD rm --stop --force -v $SERVICES
            ;;
        db)
            $PROJECT_DIR/database/local-dev/setup-db.sh --o-ex
            ;;
        dump) #TODO
            mkdir -p "$PROJECT_DIR/database/dumps"
            ip=$(docker inspect rct_database -f '{{range .NetworkSettings.Networks}}{{.IPAddress}}{{end}}');
            if [ -z "$DUMP_FILE" ]; then
                DUMP_FILE="dump"
            fi            
            export PGPASSWORD='rct-passwd';
            pg_dump --data-only --format=tar -h $ip -d "rct-db" -U "rct-user" --file="$PROJECT_DIR/database/dumps/$DUMP_FILE";
            ;;
        restore) #TODO
            ip=$(docker inspect rct_database -f '{{range .NetworkSettings.Networks}}{{.IPAddress}}{{end}}');
            if [ -z "$DUMP_FILE" ]; then
                DUMP_FILE="dump"
            fi
            RCT_DATABASE='rct-db';
            RCT_USER='postgres';
            export PGPASSWORD='postgres';
            psql -h $ip -U $RCT_USER -d $RCT_DATABASE -f "$PROJECT_DIR/database/utils/delete-data.sql";
            pg_restore --data-only -h $ip -U $RCT_USER -d $RCT_DATABASE "$PROJECT_DIR/database/dumps/$DUMP_FILE";
            ;;
        build*)
            BUILD_STAGES=$(echo ${stage#build} | sed -E "s/(\[|\:|\])/ /g")
            BUILD_STAGES=$(echo $BUILD_STAGES | sed -E "s/(^[[:space:]]*)|([[:space:]]*$)//g");
            if [ -z "$BUILD_STAGES" ]; then
                echo 'default build path'
                BUILD_STAGES="build up"
            fi
            echo $BUILD_STAGES
            for bs in $BUILD_STAGES; do
            echo "*** *** do build : $bs"
                if [ "$bs" == 'up' ]; then
                    bs="up --detach";
                fi
                build "$bs"
            done
            ;;
        follow)
            follow
            ;;
        stop)
            $COMM_PD stop $OTHER_OPTS
            ;;

        *)
            echo "incorrect stage: $stage"
            usage
            exit 1;
            ;;
    esac
done

if [ "$PRUNE_AT_THE_END" = 'true' ]; then
    $COMM_PD rm --stop --force -v
fi

cd $PREVIOD_USER_LOC