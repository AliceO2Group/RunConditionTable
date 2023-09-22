#!/bin/bash

ORG_ARGS="$*"

SCRIPTS_DIR=$(dirname $0)
MAIN_SCRIPT_NAME=$(basename $0)

STORED_SQL_FUNCTIONALITIES_DIR="$SCRIPTS_DIR/stored-sql-functionalities/"

usage () {
  cat << USAGE >&2

This script is intended to deploy database for development as well as for production. 
It requires 5 parameters provided via argument, env file, env vars (descending priority).
It must be run as postgres or using 'sudo -H -u postgres bash -c "$MAIN_SCRIPT_NAME [ARGS]"'
Usage:

    ./$MAIN_SCRIPT_NAME 
        [--env <ENV_FILE>] 
        [--host|-h <RCT_DB_HOST>] 
        [--port|-p <RCT_DB_PORT>] 
        [--database|-d <RCT_DB_NAME>] 
        [--username|-u <RCT_DB_USERNAME>] 
        [--password|-P <RCT_DB_PASSWORD>] 
        [<OTHER_OPTS>]

    Possibile env vars (also in env file) have to be named exactly the same as upper placeholders. 
    Parameters specified via script arguments override those specified via env vars.
    Default values for 'host' is 'localhost' and for 'port' is '5432'

    <OTHER_OPTS> can be:
      1. --sql-src-modify-daemon - setup watchdog over sql scripts in $SCRIPTS_DIR/stored-sql-functionalities/**
                                   any change in those files cause reinvocation of the sql scripts.
                                   !!! It works only in dev environment (env var ENV_MODE=dev );

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
        --sql-src-modify-daemon)
          SQL_SCR_MODIFY_DAEMON='true';
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
        -d|--database)
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
        -t|--terminate)
            TERMINATE=true;
            shift 1;
        ;;
        *)
            usage;
        ;;
    esac
done


if [ -n "$ENV_FILE" ]; then
  source "$ENV_FILE"
fi


#### Parameteres concretization  
RCT_DB_NAME=${__RCT_DB_NAME:-${RCT_DB_NAME:?"RCT_DB_NAME not set"}}
RCT_DB_USERNAME=${__RCT_DB_USERNAME:-${RCT_DB_USERNAME:?"RCT_DB_USERNAME not set"}}
RCT_DB_PASSWORD=${__RCT_DB_PASSWORD:-${RCT_DB_PASSWORD:?"RCT_DB_PASSWORD not set"}}
RCT_DB_HOST=${__RCT_DB_HOST:-${RCT_DB_HOST:-localhost}}
RCT_DB_PORT=${__RCT_DB_PORT:-${RCT_DB_PORT:-5432}}


if [ ! $(whoami) = 'postgres' ]; then
  echo "script must be run as postgres or using: 'sudo -H -u postgres bash -c \"$MAIN_SCRIPT_NAME [ARGS]\"'" >&2;
  echo "trying to execute script using sudo..., press any key to continue or crt+C to terminate"
  read
  sudo -H -u postgres LOCAL_USER=$(whoami) \
    bash -c "$0 $ORG_ARGS"
  exit 0;
fi


# disconnect everyone from database in order to recreate it //if dev locally it might be helpful
terminate() {
  psql -c "select pg_terminate_backend(pid) from pg_stat_activity where datname='$RCT_DB_NAME';"
}

create_db() {
  CREATE_DATABASE_CMD=$(psql -t -c "select 
    'CREATE DATABASE \"$RCT_DB_NAME\"' as cmd 
    where not exists(
      select datname from pg_database where datname = '$RCT_DB_NAME')";);

  CREATE_DATABASE_CMD=${CREATE_DATABASE_CMD:-"
    DO \$\$ 
    BEGIN 
      raise notice 'database % already exists', '$RCT_DB_NAME'; 
    END; 
    \$\$;"};
  psql -c "$CREATE_DATABASE_CMD";
}

create_stored_functionalities() {
  for path in $(find "$STORED_SQL_FUNCTIONALITIES_DIR" -name "*.sql") ; do
    echo "use of $path"
    psql -d $RCT_DB_NAME -a -f $path;
  done;
}

create_user() {
  CREATE_USER_CMD="
    DO 
    \$\$
    BEGIN
      IF not exists(select usename from pg_user where usename = '$RCT_DB_USERNAME') THEN
        SET password_encryption='scram-sha-256'; 
        CREATE USER \"$RCT_DB_USERNAME\" WITH ENCRYPTED PASSWORD '$RCT_DB_PASSWORD';

        GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO \"$RCT_DB_USERNAME\";
        GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO \"$RCT_DB_USERNAME\";
      ELSE
        raise notice 'user % already exists', '$RCT_DB_USERNAME';
      END IF;
    END;
    \$\$
  ";
  psql -d $RCT_DB_NAME -c "$CREATE_USER_CMD";
}

setup_dev_modification_watchers() {
  if [ "$ENV_MODE" == 'dev' ]; then
    if [ "$SQL_SCR_MODIFY_DAEMON" = 'true' ]; then
      inotifywait --monitor --recursive --event modify $STORED_SQL_FUNCTIONALITIES_DIR |
        while read file_path file_event file_name; do 
          echo ${file_path}${file_name} event: ${file_event}; 
          psql -d $RCT_DB_NAME -a -f "${file_path}${file_name}";
          echo ${file_path}${file_name} event: ${file_event}; 
        done &
    fi
  fi
}

if [ "$TERMINATE" == 'true ']; then
  terminate;
fi;

create_db;
create_user;
create_stored_functionalities;
setup_dev_modification_watchers;
