#!/bin/bash

ORG_ARGS="$*"

SCRIPTS_DIR=$(dirname $0)
MAIN_SCRIPT_NAME=$(basename $0)

CONVERT_SCRIPT="$SCRIPTS_DIR/mock/convert.sh"
CREATE_TABLES_SQL="$SCRIPTS_DIR/exported/create-tables.sql"
DESIGN_PNG="$SCRIPTS_DIR/exported/design.png"
DESIGN_FILE="$SCRIPTS_DIR/design.dbm"


OTHER_SQL_FILES="$SCRIPTS_DIR/other-sql/"

usage () {
  cat << USAGE >&2

This script is intended to deploy database for development as well as for production. 
It requires 5 parameters provided via argument, env file, env vars (descending priority).
It must be run as postgres or using 'sudo -H -u postgres bash -c "$MAIN_SCRIPT_NAME [ARGS]"'
Usage:

    ./$MAIN_SCRIPT_NAME [--env <ENV_FILE>] [--host <RCT_DB_HOST>] [--port <RCT_DB_PORT>] [--db <RCT_DB_NAME>] [--username <RCT_DB_USERNAME>] [--password <RCT_DB_PASSWORD>] [<OTHER_OPTS>]

    Possibile env vars (also in env file) have to be named exactly the same as upper placeholders. 
    Parameters specified via script arguments override those specified via env vars.

    <OTHER_OPTS> can be ||| TODO add descriptions |||:
      1. --main-sql-modify-daemon - 
      2. --other-sql-modify-daemon - 
      3. --export - 
      4. --only-export - 
      5. --convert - 
      6. --drop - 

USAGE
exit 1;
}

while [[ $# -gt 0 ]]; do
    case $1 in 
        --help)
            usage;
        ;;
        --env)
          ENV_FILE="$2"
          shift 2;
        ;;
        --main-sql-modify-daemon)
          MAIN_SQL_MODIFY_DAEMON='true';
          shift 1;
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
            __RCT_DB_HOST="$2";
            shift 2;
            ;;
        -p|--port)
            __RCT_DB_PORT="$2";
            shift 2;
            ;;
        -d|--db)
            __RCT_DB_NAME="$2"
            shift 2;
            ;;
        -u|--username)
            __RCT_DB_USERNAME="$2";
            shift 2;
            ;;
        -P|--password)
            __RCT_DB_PASSWORD="$2";
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

if [ -n "$ENV_FILE" ]; then
  source "$ENV_FILE"
fi


#### Parameteres concretization  
RCT_DB_NAME=${__RCT_DB_NAME:-${RCT_DB_NAME:?"RCT_DB_NAME not set"}}
RCT_DB_USERNAME=${__RCT_DB_USERNAME:-${RCT_DB_USERNAME:?"RCT_DB_USERNAME not set"}}
RCT_DB_PASSWORD=${__RCT_DB_PASSWORD:-${RCT_DB_PASSWORD:?"RCT_DB_PASSWORD not set"}}
RCT_DB_HOST=${__RCT_DB_HOST:-${RCT_DB_HOST:?"RCT_DB_HOST not set"}}
RCT_DB_PORT=${__RCT_DB_PORT:-${RCT_DB_PORT:?"RCT_DB_PORT not set"}}


if [ ! $(whoami) = 'postgres' ]; then
  echo "script must be run as postgres or using: 'sudo -H -u postgres bash -c \"$MAIN_SCRIPT_NAME [ARGS]\"'" >&2;
  echo "trying to execute script using sudo..., press any key to continue or crt+C to terminate"
  read
  sudo -H -u postgres LOCAL_USER=$(whoami) \
    bash -c "$0 $ORG_ARGS --rerun"
  exit 0;
fi



# disconnect everyone from database in order to recreate it //if dev locally it might be helpful
terminate() {
  psql -c "select pg_terminate_backend(pid) from pg_stat_activity where datname='$RCT_DB_NAME';"
}
drop() {
  psql -c "DROP DATABASE IF EXISTS \"$RCT_DB_NAME\""
  psql -c "DROP USER IF EXISTS \"$RCT_DB_USERNAME\""
}

create_main() {
  psql -c "CREATE USER \"$RCT_DB_USERNAME\" WITH ENCRYPTED PASSWORD '$RCT_DB_PASSWORD';"
  psql -c "CREATE DATABASE \"$RCT_DB_NAME\""
  psql -d $RCT_DB_NAME -a -f $CREATE_TABLES_SQL
}

create_other() {
  for p in $(find "$OTHER_SQL_FILES" -name "*.sql") ; do
    echo "use of $p"
    psql -d $RCT_DB_NAME -a -f $p
  done;
}

grant() {
  # psql -c "ALTER DATABASE \"$RCT_DB_NAME\" OWNER TO \"$RCT_DB_USERNAME\""
  # psql -c "GRANT ALL PRIVILEGES ON DATABASE \"$RCT_DB_NAME\" TO \"$RCT_DB_USERNAME\""
  psql -d $RCT_DB_NAME -c "GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO \"$RCT_DB_USERNAME\""
  psql -d $RCT_DB_NAME -c "GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO \"$RCT_DB_USERNAME\""
}


terminate
if [ "$DROP" = 'true' ]; then
  drop
fi
create_main
create_other
grant
psql -d $RCT_DB_NAME -c "call insert_period('TMP', null, null);";


if [ "$MAIN_SQL_MODIFY_DAEMON" = 'true' ]; then
  inotifywait --monitor --recursive --event modify "$SCRIPTS_DIR/exported/" |
    while read file_path file_event file_name; do 
      echo ${file_path}${file_name} event: ${file_event}; 
      SWP_DUMP="/postgres/run/database/cache/dumps/.dump.swp"
      pg_dump --data-only --format=tar -d $RCT_DB_NAME --file="$SWP_DUMP";
      psql -c "DROP SCHEME public CASCADE;";
      psql -c "CREATE SCHEME public;";
      create_main
      create_other
      grant
      pg_restore --data-only -d $RCT_DB_NAME "$SWP_DUMP";
      echo ${file_path}${file_name} event: ${file_event}; 
    done &
fi
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
