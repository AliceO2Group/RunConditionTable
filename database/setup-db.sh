#!/bin/bash

#if localy run < sudo -H -u postgres bash -c "./setup-db.sh --dev" > in <root>/database directory
if [ ! $(whoami) = "postgres" ]; then
  echo "script must be run as postgres or using < sudo -H -u postgres bash -c \"PATH_TO<setup-db.sh> [--dev]\" " >&2
  exit 1;
fi

SCRIPTS_DIR=$(dirname $0)

RCT_DATABASE="rct-db"
RCT_USER="rct-user"
RCT_PASSWORD="rct-passwd"
RCT_DATABASE_HOST="localhost"
CREATE_TABLES_SQL="$SCRIPTS_DIR/create-tables.sql"


# disconnect everyone from database in order to recreate it //if dev locally it is helpful
psql -c "select pg_terminate_backend(pid) from pg_stat_activity where datname='$RCT_DATABASE';"

psql -c "DROP DATABASE IF EXISTS \"$RCT_DATABASE\""
psql -c "DROP USER IF EXISTS \"$RCT_USER\""
psql -c "CREATE USER \"$RCT_USER\" WITH ENCRYPTED PASSWORD '$RCT_PASSWORD';"
psql -c "CREATE DATABASE \"$RCT_DATABASE\""
psql -d $RCT_DATABASE -a -f $CREATE_TABLES_SQL

# psql -c "ALTER DATABASE \"$RCT_DATABASE\" OWNER TO \"$RCT_USER\""
# psql -c "GRANT ALL PRIVILEGES ON DATABASE \"$RCT_DATABASE\" TO \"$RCT_USER\""
psql -d $RCT_DATABASE -c "GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO \"$RCT_USER\""
psql -d $RCT_DATABASE -c "GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO \"$RCT_USER\""




if [ "$MOCK_DB" = "true" ] || [ "$1" == "--mock" ]; then
  SCRIPT_PATH="$SCRIPTS_DIR/mock/mockData.py"
  MOCK_DATA="$SCRIPTS_DIR/mock/mock.tar"
  # pg_restore -d $RCT_DATABASE $MOCK_DATA
  # psql -d $RCT_DATABASE -c "select * from periods;"
  # whereis python3

  # RCT_USER=$RCT_USER \
  # RCT_DATABASE=$RCT_DATABASE \
  # RCT_PASSWORD=$RCT_PASSWORD \
  # RCT_DATABASE_HOST=$RCT_DATABASE_HOST \
  # CACHED_PATH="$SCRIPTS_DIR/cached" \
  #   python3 $SCRIPT_PATH

fi
