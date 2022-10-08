#!/bin/bash

SCRIPTS_DIR=$(dirname $0)
MAIN_SCRIPT_NAME=$(basename $0)

#if localy run < sudo -H -u postgres bash -c "./setup-db.sh --dev" > in <root>/database/ directory
if [ ! $(whoami) = 'postgres' ]; then
  echo "script must be run as postgres or using < sudo -H -u postgres bash -c \"$MAIN_SCRIPT_NAME [--mock [--python]]\" " >&2
  echo "see $SCRIPTS_DIR/local-dev/local-setup.sh"
  exit 1;
fi

# TODO env vars usage
RCT_DATABASE=${RCT_DB_NAME:-'rct-db'}
RCT_USER=${RCT_DB_USERNAME:-'rct-user'}
RCT_PASSWORD=${RCT_DB_PASSWORD:-'rct-passwd'}
RCT_DATABASE_HOST=${RCT_DB_HOST:-'localhost'}
CREATE_TABLES_SQL="$SCRIPTS_DIR/exported/create-tables.sql"
STORED_PROCEDURES_DIR="$SCRIPTS_DIR/procedures"
DESIGN_FILE="$SCRIPTS_DIR/design.dbm"



# disconnect everyone from database in order to recreate it //if dev locally it might be helpful
psql -c "select pg_terminate_backend(pid) from pg_stat_activity where datname='$RCT_DATABASE';"
psql -c "DROP DATABASE IF EXISTS \"$RCT_DATABASE\""
psql -c "DROP USER IF EXISTS \"$RCT_USER\""
psql -c "CREATE USER \"$RCT_USER\" WITH ENCRYPTED PASSWORD '$RCT_PASSWORD';"
psql -c "CREATE DATABASE \"$RCT_DATABASE\""
psql -d $RCT_DATABASE -a -f $CREATE_TABLES_SQL
for p in "$STORED_PROCEDURES_DIR/"*.sql ; do
  echo "use $p"
  psql -d $RCT_DATABASE -a -f $p
done;
psql -d $RCT_DATABASE -c "call insert_period('TMP', null, null);";

# psql -c "ALTER DATABASE \"$RCT_DATABASE\" OWNER TO \"$RCT_USER\""
# psql -c "GRANT ALL PRIVILEGES ON DATABASE \"$RCT_DATABASE\" TO \"$RCT_USER\""
psql -d $RCT_DATABASE -c "GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO \"$RCT_USER\""
psql -d $RCT_DATABASE -c "GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO \"$RCT_USER\""


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
    pg_restore -d $RCT_DATABASE $MOCK_DATA
  else 
    # TODO '--big-data' flag

    CACHED_PATH="$SCRIPTS_DIR/local-dev/cached"
    RCT_USER=$RCT_USER \
    RCT_DATABASE=$RCT_DATABASE \
    RCT_PASSWORD=$RCT_PASSWORD \
    RCT_DATABASE_HOST=$RCT_DATABASE_HOST \
    CACHED_PATH="$CACHED_PATH" \
    DUMP_PATH="$SCRIPT_DIR/mock/mock.tar" \
    RCT_MOCKDATA_GENERATOR_DEL_CACHE="true" \
    LOG_EXCEPTIONS=$(if [ "$3" = "--debug" ]; then echo true; else echo false; fi) \
      python3 $SCRIPT_PATH
    
    echo "creating dump of database data to $MOCK_DATA"
    pg_dump --file=$MOCK_DATA --format=tar --data-only $RCT_DATABASE
    chmod -R o+w $CACHED_PATH
    chmod o+w $MOCK_DATA
  fi
fi
