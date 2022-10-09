#!/bin/bash

ORG_ARGS="$*"

SCRIPTS_DIR=$(dirname $0)
MAIN_SCRIPT_NAME=$(basename $0)

CONVERT_SCRIPT="$SCRIPTS_DIR/mock/convert.sh"
CREATE_TABLES_SQL="$SCRIPTS_DIR/exported/create-tables.sql"
DESIGN_PNG="$SCRIPTS_DIR/exported/design.png"
DESIGN_FILE="$SCRIPTS_DIR/design.dbm"

RCT_DB_NAME=${RCT_DB_NAME:-'rct-db'}
RCT_DB_USERNAME=${RCT_DB_USERNAME:-'rct-user'}
RCT_DB_PASSWORD=${RCT_DB_PASSWORD:-'rct-passwd'}
RCT_DB_HOST=${RCT_DB_HOST:-'localhost'}
RCT_DB_PORT=${RCT_DB_PORT:-5432}

OTHER_SQL_FILES="$SCRIPTS_DIR/other-sql/"

usage () {
  cat << USAGE >&2
TODO  
USAGE
exit 1;
}

while [[ $# -gt 0 ]]; do
    case $1 in 
        --help)
            usage;
        ;;
        --other-sql-modify-daemon)
          OTHER_SQL_MODIFY_DAEMON='true';
          shift 1;
        ;;
        --export)
            EXPORT='true';
            shift 1;
            ;;
        --only-export)
            EXPORT='true';
            ONLY_EXPORT='true';
            shift 1;
        ;;
        --convert)
            CONVERT='true';
            shift 1;
        ;;
        --drop)
          DROP='true';
          shift 1;
        ;;
        --rerun)
          RERUN='true';
          shift 1;
        ;;
        -h|--host)
            RCT_DB_HOST="$2";
            shift 2;
            ;;
        -p|--port)
            RCT_DB_PORT="$2";
            shift 2;
            ;;
        -d|--db)
            RCT_DB_NAME="$2"
            shift 2;
            ;;
        -u|--username)
            RCT_DB_USERNAME="$2";
            shift 2;
            ;;
        -P|--password)
            RCT_DB_PASSWORD="$2";
            shift 2;
            ;;

        *)
            usage;
            ;;
    esac
done

if [ ! "$RERUN" = 'true' ]; then
  if [ "$EXPORT" = 'true' ]; then
    if ! command -v "pgmodeler-cli" &> /dev/null; then
      echo "Could not find pgmodeler-cli, continuing with existing sql file"
      sleep 1
    else 
      echo 'exporting fresh sql file from design'
      pgmodeler-cli --input $DESIGN_FILE --export-to-file --output $CREATE_TABLES_SQL
      pgmodeler-cli --input $DESIGN_FILE --export-to-png --output $DESIGN_PNG
    fi

    if [ "$ONLY_EXPORT" = 'true' ]; then
      exit 0;
    fi
  fi


  if [ "$CONVERT" = 'true' ] && ! $CONVERT_SCRIPT; then
      echo "converting mock.ipynb to python script was not successful"
      sleep 1
  fi
fi

if [ ! $(whoami) = 'postgres' ]; then
  echo "script must be run as postgres or using: 'sudo -H -u postgres bash -c \"$MAIN_SCRIPT_NAME [ARGS]\"'" >&2;
  sudo -H -u postgres LOCAL_USER=$(whoami) \
    bash -c "$0 $ORG_ARGS --rerun"
  exit 0;
fi



# disconnect everyone from database in order to recreate it //if dev locally it might be helpful
psql -c "select pg_terminate_backend(pid) from pg_stat_activity where datname='$RCT_DB_NAME';"

if [ "$DROP" = 'true' ]; then
  psql -c "DROP DATABASE IF EXISTS \"$RCT_DB_NAME\""
  psql -c "DROP USER IF EXISTS \"$RCT_DB_USERNAME\""
fi


psql -c "CREATE USER \"$RCT_DB_USERNAME\" WITH ENCRYPTED PASSWORD '$RCT_DB_PASSWORD';"
psql -c "CREATE DATABASE \"$RCT_DB_NAME\""
psql -d $RCT_DB_NAME -a -f $CREATE_TABLES_SQL
for p in $(find "$OTHER_SQL_FILES" -name "*.sql") ; do
  echo "use of $p"
  psql -d $RCT_DB_NAME -a -f $p
done;
psql -d $RCT_DB_NAME -c "call insert_period('TMP', null, null);";

# psql -c "ALTER DATABASE \"$RCT_DB_NAME\" OWNER TO \"$RCT_DB_USERNAME\""
# psql -c "GRANT ALL PRIVILEGES ON DATABASE \"$RCT_DB_NAME\" TO \"$RCT_DB_USERNAME\""
psql -d $RCT_DB_NAME -c "GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO \"$RCT_DB_USERNAME\""
psql -d $RCT_DB_NAME -c "GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO \"$RCT_DB_USERNAME\""

if [ "$OTHER_SQL_MODIFY_DAEMON" = 'true' ]; then
  inotifywait --monitor --recursive --event modify $OTHER_SQL_FILES |
    while read file_path file_event file_name; do 
      echo ${file_path}${file_name} event: ${file_event}; 
      psql -d $RCT_DB_NAME -a -f "${file_path}${file_name}";
      echo ${file_path}${file_name} event: ${file_event}; 
    done &
fi

 # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # #
 # TODO section

mock_use_info() {
  car << info >&2
Info: 
  ***********************************************
  ***********************************************
  *********                         *************
  *********       MOCK DATA         *************
  *********                         *************
  *********                         *************
  ***********************************************
  ***********************************************
info
}

if [ "$MOCK_DB" = "true" ] || [ "$1" == "--mock" ]; then
  mock_use_info

  SCRIPT_PATH="$SCRIPTS_DIR/mock/mockData.py"
  MOCK_DATA="$SCRIPTS_DIR/mock/mock.tar"
  
  if [ "$2" != "--python" ]; then
    echo "restoring database data from $MOCK_DATA"
    pg_restore -d $RCT_DB_NAME $MOCK_DATA
  else 
    # TODO '--big-data' flag

    (\
    export CACHED_PATH="$SCRIPTS_DIR/local-dev/cached"
    export RCT_DB_USERNAME=$RCT_DB_USERNAME \
    export RCT_DB_NAME=$RCT_DB_NAME \
    export RCT_DB_PASSWORD=$RCT_DB_PASSWORD \
    export RCT_DB_HOST=$RCT_DB_HOST \
    export CACHED_PATH="$CACHED_PATH" \
    export DUMP_PATH="$SCRIPT_DIR/mock/mock.tar" \
    export RCT_MOCKDATA_GENERATOR_DEL_CACHE="true" \
    export LOG_EXCEPTIONS=$(if [ "$3" = "--debug" ]; then echo true; else echo false; fi) \
      python3 $SCRIPT_PATH \
    )
    echo "creating dump of database data to $MOCK_DATA"
    pg_dump --file=$MOCK_DATA --format=tar --data-only $RCT_DB_NAME
    chmod -R o+w $CACHED_PATH
    chmod o+w $MOCK_DATA
  fi
fi
