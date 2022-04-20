#!/bin/bash

SCRIPTS_DIR=$(dirname $0)
NOTEBOOK_PATH="$SCRIPTS_DIR/mockData.ipynb"

jupyter nbconvert $NOTEBOOK_PATH --to script