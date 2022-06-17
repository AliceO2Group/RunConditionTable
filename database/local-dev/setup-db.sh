#!/bin/bash
SCRIPTS_DIR=$(dirname $0)

MAIN_SCRIPT="$SCRIPTS_DIR/../setup-db.sh"
CONVERT_SCRIPT="$SCRIPTS_DIR/../mock/convert.sh"

CREATE_TABLES_SQL="$SCRIPTS_DIR/../create-tables.sql.q"
DESIGN_FILE="$SCRIPTS_DIR/../design.dbm"

if ! $CONVERT_SCRIPT; then
    echo "converting mock.ipynb to python script was not successful, continue ? [y/[n]]"
    read permission
    if [ "$permission" != "y" ]; then
        exit 1;
    fi
fi

if ! command -v "pgmodeler-cli" &> /dev/null; then
  echo "Could not find pgmodeler-cli, continue with existing sql file y|[n] ?"
  read permission
  if [[ "$permission" =~ ^yes|y|Y|YES$ ]]; then
    echo "continuing"
  else 
    exit 1;
  fi
else 
  echo 'exporting fresh sql file from design'
  pgmodeler-cli --input $DESIGN_FILE --export-to-file --output $CREATE_TABLES_SQL
fi



sudo -H -u postgres LOCAL_USER=$(whoami) \
bash -c "$MAIN_SCRIPT $*"

