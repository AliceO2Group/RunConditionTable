#!/bin/bash

DESIGN_PATH="database/design.dbm"
if ! git diff --cached --quiet -- "$DESIGN_PATH"; then 
    ./rctmake db:export
    if [ "$?" != '0' ]; then
        echo "Could not fulfil hook requirements <= cannot export sql and image from $DESIGN_PATH"
        exit 1;
    fi
fi
