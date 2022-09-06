#!/bin/bash

APP_CONTATINER_NAME=rct_application
DB_CONTATINER_NAME=rct_database

usage() {
    cat << USAGE >&2
Usage:
        ./make.sh -s|--stages <STAGES> [<OTHER_OPTS>]
        where STAGES is comma separeted list of sequentialy preformed stages.
        STGAES are:
            1. prune - delete both contatiners, all virtual volumens
                e.g.: ./make.sh -s prune

            2. db - export db sql definition from pgmodeler design
                e.g.: ./make.sh -s db

            3. dump:make - make dump of current database (in docker contatiner) data, 
                      need option -F|--dump-file <FILE> to specify dump file name
                e.g.: ./make.sh -s dump -F dump_1
            
            4. dump:list - make list cached dumps
            
            5. dump:remove - remove dump from cache specified by flag -F|--dumo-file <FILE>

            6. dump:resotre - restore data from dump (see stage dump (3.)). Use flag -F|--dump-file <FILE>
                e.g.: ./make.sh -s restore -F dump_1

            7. build|build[BUILD_STATGES] - build application (deploys contatiners). By defualt 
                    build stage behaves as docker-compose ... up --build.
                    BUILD_STATGES are colon separated docker-compose tasks like build,up
                Using build stage requires usage of -|--target flag wich specifies one of prod,dev,test.
                e.g.: ./make.sh -s build -t dev
                      ./make.sh -s build[up] -t dev
            8. follow - like docker-compose follow
            9. stop - stop contatiners

        For stages build, follow, stop, prune additional flag can be specified; -S|--service <SERVICE>,
        which specify service ($DB_CONTATINER_NAME or $APP_CONTATINER_NAME) which stages are performed for.
    
    * * * * * * * * * * * * * * * * * * * * * * * * 
    error reason: $1
    * * * * * * * * * * * * * * * * * * * * * * * * 

USAGE
    exit 1;
    
}




PREVIOD_USER_LOC=$(pwd);
PROJECT_DIR="$(dirname $(realpath $0))";
DOCKER_DIR="$PROJECT_DIR/docker";
cd $DOCKER_DIR;

COMM_PD="docker-compose --project-directory $PROJECT_DIR ";

# defualt behaviour => dettached production built
STAGES='prune build'
TARGET='prod'

while [[ $# -gt 0 ]]; do
    case $1 in 
        -h|--help)
            usage;
        ;;
        -s|--stages)
            STAGES=$(echo $2 | tr ',' ' ');
            shift 2;
            ;;
        -t|--target)
            TARGET=$2;
            shift 2;
            ;;
        -S|--service)
            SERVICES="$SERVICES $(echo $2 | tr ',' ' ')";
            shift 2;
            ;;
        -m|--mock)
            MOCK_DB=true;
            shift 1;
            ;;
        -f|--follow)
            FOLLOW=true;
            shift 1;
            ;;
        -p|--prune)
            PRUNE_AT_THE_END=true;
            shift 1;
            ;;
        -a|--attach)
            ATTACH_TO_APP=true;
            shift 1;
            ;;
        -F|--dump-file)
            DUMP_FILE=$2;
            shift 2;
            ;;
        *)
            OTHER_OPTS="$OTHER_OPTS $1";
            shift 1;
            ;;
    esac
done

MOCK_DB=${MOCK_DB:-false};
export MOCK_DB;

follow() {
    cd $DOCKER_DIR
    $COMM_PD logs --follow $OTHER_OPTS
    cd -
}

build() {
    mkdir -p $PROJECT_DIR/security;
    ORDER=$1;
    case $TARGET in 
        dev)
            $COMM_PD \
                -f docker-compose.yml \
                -f docker-compose-dev.yml \
                -f docker-compose-dev-expose.yml \
                $ORDER $OTHER_OPTS $SERVICES;
            if [ "$ATTACH_TO_APP" = 'true' ]; then
                docker attach $APP_CONTATINER_NAME;
            fi
        ;;

        prod)
            $COMM_PD \
                -f docker-compose.yml \
                -f docker-compose-prod.yml \
                -f docker-compose-expose.yml \
                $ORDER $OTHER_OPTS $SERVICES;
        ;;

        test)
            mkdir -p $PROJECT_DIR/reports;
            $COMM_PD \
                -f docker-compose.yml \
                -f docker-compose-test.yml \
                up --build --abort-on-container-exit $OTHER_OPTS;
        ;;
        *)
            usage "incorrect build target: $TARGET";
            ;;
    esac

    if [ "$TARGET" != 'test' ] && [ "$FOLLOW" = 'true' ]; then
        follow;
    fi
}


for stage in $STAGES; do
    echo " *** do $stage";
    case $stage in
        prune)
            $COMM_PD rm --stop --force -v $SERVICES;
        ;;

        db)
            $PROJECT_DIR/database/local-dev/setup-db.sh --o-ex;
        ;;
        
        dump*)
            DUMP_CMD=$(echo ${stage#dump:});
            mkdir -p "$PROJECT_DIR/database/dumps";
            ip=$(docker inspect $DB_CONTATINER_NAME -f '{{range .NetworkSettings.Networks}}{{.IPAddress}}{{end}}');
            RCT_DATABASE='rct-db';
            RCT_USER='postgres';
            DUMP_PATH="$PROJECT_DIR/database/dumps/$DUMP_FILE";

            case $DUMP_CMD in
                make)
                    if [ -z "$DUMP_FILE" ]; then
                        usage "dump file unspecified, use flag -F|--dump-file <FILE>";
                    fi
                    if [ -f "$DUMP_PATH" ]; then
                        echo "Do you want to overwrite existing file $DUMP_FILE :  y|[n] ?"
                        read permission
                        if [[ "$permission" =~ ^yes|y|Y|Yes$ ]]; then
                            echo "continuing"
                        else 
                            DO_NOT_PERFORME_WHILE_FILE_EXISTS=true;
                            echo 'makig dump stopped';
                        fi
                    fi

                    if [ -z $DO_NOT_PERFORME_WHILE_FILE_EXISTS ]; then
                        docker exec $DB_CONTATINER_NAME \
                            pg_dump --data-only --format=tar -d $RCT_DATABASE -U $RCT_USER \
                                --file="$DUMP_FILE";
                        docker cp "$DB_CONTATINER_NAME:/postgres/run/$DUMP_FILE" $DUMP_PATH;
                    fi
                ;;

                list)
                    ls -alh "$PROJECT_DIR/database/dumps/";
                ;;

                restore)
                    if [ -z "$DUMP_FILE" ]; then
                        usage "dump file unspecified, use flag -F|--dump-file <FILE>";
                    fi
                    docker cp "$PROJECT_DIR/database/utils/delete-data.sql" "$DB_CONTATINER_NAME:/postgres/run/"
                    docker exec $DB_CONTATINER_NAME psql -U $RCT_USER -d $RCT_DATABASE -f "delete-data.sql";
                    
                    docker cp $DUMP_PATH "$DB_CONTATINER_NAME:/postgres/run/"
                    docker exec $DB_CONTATINER_NAME \
                        pg_restore --data-only -U $RCT_USER \
                            -d $RCT_DATABASE $DUMP_FILE;
                ;;

                remove)
                    if [ -z "$DUMP_FILE" ]; then
                        usage "dump file unspecified, use flag -F|--dump-file <FILE>";
                    fi 
                    rm $DUMP_PATH;
                ;;

                *)
                    usage 'incorrect dump: subcommand';
                ;;
            esac
        ;;

        build*)
            BUILD_STAGES=$(echo ${stage#build} | sed -E "s/(\[|\:|\])/ /g");
            BUILD_STAGES=$(echo $BUILD_STAGES | sed -E "s/(^[[:space:]]*)|([[:space:]]*$)//g");
            if [ -z "$BUILD_STAGES" ]; then
                echo 'default build[build,up]; up in detached mode';
                BUILD_STAGES="build up";
            fi
            echo $BUILD_STAGES;
            for bs in $BUILD_STAGES; do
                echo "*** *** do build : $bs";
                if [ "$bs" == 'up' ]; then
                    bs="up --detach";
                fi
                build "$bs";
            done
        ;;

        follow)
            follow;
        ;;

        stop)
            $COMM_PD stop $OTHER_OPTS;
        ;;

        *)
            usage "incorrect stage: $stage";
        ;;
    esac
done

if [ "$PRUNE_AT_THE_END" = 'true' ]; then
    $COMM_PD rm --stop --force -v;
fi

cd $PREVIOD_USER_LOC;