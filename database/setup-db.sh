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

  SCRIPT_PATH="mock/mockData.py"
  RCT_USER=$RCT_USER RCT_DATABASE=$RCT_DATABASE RCT_PASSWORD=$RCT_PASSWORD RCT_DATABASE_HOST=$RCT_DATABASE_HOST \
    python -m $SCRIPT_PATH

fi
