#!/bin/bash

DB_NAME="rct-db-v3"
RCT_USER="rct-user"
CREATE_SCRIPT="create-db.sql"
NOTEBOOK_NAME="parseAndInsertOldData.ipynb"

if [ "$1" != "-oi" ]; then
  sed -i -E "s/\`/\"/g" $CREATE_SCRIPT # script from dynobird...

  cp $CREATE_SCRIPT ~postgres/
  sudo -H -u postgres bash -c "./create-db.sh $DB_NAME $RCT_USER $CREATE_SCRIPT"
  rm ~postgres/$CREATE_SCRIPT
fi


if [ "$1" = "-oc" ]; then
	exit 0
fi

CONDA_DIR=/opt/anaconda3/
CONDA_BIN=/opt/anaconda3/bin/
source $CONDA_DIR/etc/profile.d/conda.sh
conda activate base
ipython --TerminalIPythonApp.file_to_run=$NOTEBOOK_NAME
