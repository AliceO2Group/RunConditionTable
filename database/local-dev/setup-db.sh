#!/bin/bash
SCRIPTS_DIR=$(dirname $0)

MAIN_SCRIPT="$SCRIPTS_DIR/../setup-db.sh"
CONVERT_SCRIPT="$SCRIPTS_DIR/../mock/convert.sh"

CREATE_TABLES_SQL="$SCRIPTS_DIR/../exported/create-tables.sql"
DESIGN_PNG="$SCRIPTS_DIR/../exported/design.png"
DESIGN_FILE="$SCRIPTS_DIR/../design.dbm"


if ! command -v "pgmodeler-cli" &> /dev/null; then
  echo "Could not find pgmodeler-cli, continuing with existing sql file"
  sleep 1
else 
  echo 'exporting fresh sql file from design'
  pgmodeler-cli --input $DESIGN_FILE --export-to-file --output $CREATE_TABLES_SQL
  pgmodeler-cli --input $DESIGN_FILE --export-to-png --output $DESIGN_PNG
fi

if [ "$1" = "--o-ex" ]; then
  exit 0;
fi

if ! $CONVERT_SCRIPT; then
    echo "converting mock.ipynb to python script was not successful"
    sleep 1
fi

sudo -H -u postgres LOCAL_USER=$(whoami) \
  bash -c "$MAIN_SCRIPT $*"

