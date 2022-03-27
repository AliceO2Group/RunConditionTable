#!/bin/bash

#if localy run < sudo -H -u postgres bash -c "./setup-db.sh --dev" > in <root>/database directory

SCRIPTS_DIR=$(dirname $0)

RCT_DATABASE="rct-db"
RCT_USER="rct-user"
RCT_PASSWORD="rct-passwd"
RCT_DATABASE_HOST="localhost"

CREATE_TABLES_SQL="$SCRIPTS_DIR/create-tables.sql"
CREATE_TABLES_SH="$SCRIPTS_DIR/setup-db-subscripts/create-tables.sh "
$CREATE_TABLES_SH \
  $RCT_DATABASE \
  $RCT_USER \
  $RCT_PASSWORD \
  $CREATE_TABLES_SQL


echo $DEV
if [ "$DEV" = "true" ] || [ "$1" == "--dev" ]; then
  SCRIPT_PATH="$SCRIPTS_DIR/mock/mockData.py"

  whereis python3

  RCT_USER=$RCT_USER \
  RCT_DATABASE=$RCT_DATABASE \
  RCT_PASSWORD=$RCT_PASSWORD \
  RCT_DATABASE_HOST=$RCT_DATABASE_HOST \
  CACHED_PATH="$SCRIPTS_DIR/cached" \
    python3 $SCRIPT_PATH

fi
