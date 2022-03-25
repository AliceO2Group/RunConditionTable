#!/bin/bash

DB_NAME=$1
RCT_USER=$2
CREATE_SCRIPT=$3

# disconnect everyone from database in order to recreate it
psql -c "select pg_terminate_backend(pid) from pg_stat_activity where datname='$DB_NAME';"

cd ~
psql -c "DROP DATABASE IF EXISTS \"$DB_NAME\""
psql -c "CREATE DATABASE \"$DB_NAME\""
psql -d $DB_NAME -a -f $CREATE_SCRIPT

# psql -c "ALTER DATABASE \"$DB_NAME\" OWNER TO \"$RCT_USER\""
# psql -c "GRANT ALL PRIVILEGES ON DATABASE \"$DB_NAME\" TO \"$RCT_USER\""
psql -d $DB_NAME -c "GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO \"$RCT_USER\""
psql -d $DB_NAME -c "GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO \"$RCT_USER\""


