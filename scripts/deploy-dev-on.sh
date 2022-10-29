#!/bin/bash

usage() {
    cat << USAGE >&2
Usage:
    Script dedicated to deploy dev instance or RCT on 
    syntax :: ---------------------------------------
    |    $(basename $0) USER           |
    -------------------------------------------------
    USER is your cern username
USAGE
    exit 1;
}

USER=$1
TARGET_BRANCH=$2
TARGET_DUMP=$3

ssh -J $USER@lxplus.cern.ch root@rct-test rctDeploy $TARGET_BRANCH $TARGET_DUMP
