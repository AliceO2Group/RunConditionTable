#!/bin/bash

DESIGN_PATH="database/design.dbm"
if ! git diff --cached --quiet -- "$DESIGN_PATH"; then 
    if ! ./rctmake db:export; then
        echo "Could not fulfil hook requirements <= cannot export sql and image from $DESIGN_PATH"
        exit 1;
    fi
fi
