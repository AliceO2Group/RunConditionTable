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
    case $TARGET in 
        dev)
            $COMM_PD \
                -f docker-compose.yml \
                -f docker-compose-dev.yml \
                -f docker-compose-dev-expose.yml \
                up --build --detach $OTHER_OPTS $SERVICES
        ;;

        prod)
            $COMM_PD \
                -f docker-compose.yml \
                -f docker-compose-expose.yml \
                up --build --detach $OTHER_OPTS $SERVICES
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
    case $stage in
        prune)
            $COMM_PD rm --stop --force -v $SERVICES
            ;;

        db)
            $PROJECT_DIR/database/local-dev/setup-db.sh --o-ex
            ;;

        build)
            build
            ;;
        follow)
            follow
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