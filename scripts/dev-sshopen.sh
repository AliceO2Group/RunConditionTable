#!/bin/bash 

usage() {
    cat << USAGE >&2
Usage:
    Script dedicated to open ssh proxy for dockers to reach CERN network,
    CERN network is exposed to assoc 17.200.200.1:12345
    $(basename $0) USER SERVER_NAME
    SERVER_NAME is part of SERVER_NAME.cern.ch
    USER is your cern username
USAGE
}

USER=$1
SERVER_NAME=$2

if [ -z "$USER" ] || [ -z "$SERVER_NAME" ]; then
    usage
    exit 1
fi


echo $1@$2
ssh -D 172.200.200.1:12345 "$1@$2.cern.ch"