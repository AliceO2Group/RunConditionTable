#!/bin/bash

echo $0
echo $@

DB_NAME=$1
RCT_USER=$2
RCT_PASSWORD=$3
CREATE_TABLES_SQL=$4

# disconnect everyone from database in order to recreate it
psql -c "select pg_terminate_backend(pid) from pg_stat_activity where datname='$DB_NAME';"

psql -c "DROP DATABASE IF EXISTS \"$DB_NAME\""
psql -c "DROP USER IF EXISTS \"$RCT_USER\""
psql -c "CREATE USER \"$RCT_USER\" WITH ENCRYPTED PASSWORD '$RCT_PASSWORD';"
psql -c "CREATE DATABASE \"$DB_NAME\""
psql -d $DB_NAME -a -f $CREATE_TABLES_SQL

# psql -c "ALTER DATABASE \"$DB_NAME\" OWNER TO \"$RCT_USER\""
# psql -c "GRANT ALL PRIVILEGES ON DATABASE \"$DB_NAME\" TO \"$RCT_USER\""
psql -d $DB_NAME -c "GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO \"$RCT_USER\""
psql -d $DB_NAME -c "GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO \"$RCT_USER\""


