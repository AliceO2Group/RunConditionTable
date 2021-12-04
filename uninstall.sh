#!/bin/bash

UNITNAME_FILE="unit_name.txt"

UNIT_NAME=$(cat $UNITNAME_FILE)

systemctl stop $UNIT_NAME
systemctl disable $UNIT_NAME

