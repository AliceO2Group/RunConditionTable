#!/bin/bash

MAIN_SCRIPT="$(dirname $0)/../setup-db.sh"
sudo -H -u postgres bash -c "$MAIN_SCRIPT $1"

