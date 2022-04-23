#!/bin/bash

MAIN_SCRIPT="$(dirname $0)/../setup-db.sh"
CONVERT_SCRIPT="$(dirname $0)/../mock/convert.sh"

if ! $CONVERT_SCRIPT; then
    echo "converting mock.ipynb to python script was not successful, continue ? [y/[n]]"
    read permission
    if [ "$permission" != "y" ]; then
        exit 1;
    fi
fi


sudo -H -u postgres LOCAL_USER=$(whoami) \
bash -c "$MAIN_SCRIPT $*"

