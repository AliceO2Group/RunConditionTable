#!/bin/bash

if [ "$RUNNING_ENV" != 'DOCKER' ]; then
    echo \
    "Warning this script is rather intended
    to setup environment in docker contatiner.
    If it is docker contatiner check wheter
    env var RUNNING_ENV has proper value assign,
    it should be 'DOCKER'";
fi
