#!/bin/bash 

TARGET_HOST='172.200.200.1'
TARGET_PORT='12345'

usage() {
    cat << USAGE >&2
Usage:
    Script dedicated to open ssh proxy for dockers to reach CERN network,
    CERN network is exposed to assoc $TARGET_HOST:$TARGET_PORT
    syntax :: ---------------------------------------
    |    $(basename $0) USER SERVER_NAME             |
    -------------------------------------------------
    SERVER_NAME is part of <SERVER_NAME>.cern.ch
    USER is your cern username
USAGE

    exit 1;
}

if [ "$1" = '--help' ]; then
    usage;
fi

USER=$1
SERVER_NAME=$2

if [ -z "$USER" ] || [ -z "$SERVER_NAME" ]; then
    usage
    exit 1
fi


echo $1@$2
ssh -D "$TARGET_HOST:$TARGET_PORT" "$USER@$SERVER_NAME.cern.ch"