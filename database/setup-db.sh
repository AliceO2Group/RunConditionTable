#!/bin/bash

RCT_DATABASE="rct-db"
RCT_USER="rct-user"
RCT_PASSWORD="rct-passwd"
RCT_DATABASE_HOST="localhost"

CREATE_SCRIPT="create-db.sql"

cp $CREATE_SCRIPT ~postgres/
sudo -H -u postgres bash -c "./create-db.sh $RCT_DATABASE $RCT_USER $CREATE_SCRIPT"
rm ~postgres/$CREATE_SCRIPT


if [ "$1" = "--dev" ]; then

  NOTEBOOK_NAME="mock/mockData.ipynb"
  CONDA_DIR=/opt/anaconda3/
  CONDA_BIN=/opt/anaconda3/bin/
  source $CONDA_DIR/etc/profile.d/conda.sh
  conda activate base
  RCT_USER=$RCT_USER RCT_DATABASE=$RCT_DATABASE RCT_PASSWORD=$RCT_PASSWORD RCT_DATABASE_HOST=$RCT_DATABASE_HOST ipython --TerminalIPythonApp.file_to_run=$NOTEBOOK_NAME $RCT_DATABASE $RCT_USER

fi
