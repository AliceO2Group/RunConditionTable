#!/bin/bash

if [ "$RUNNING_ENV" != 'DOCKER' ]; then
    echo \
    "Warning this script is intended
    to setup environment in docker container.
    If it is docker container check whether
    env var RUNNING_ENV has proper value assign,
    it should be 'DOCKER'";
    exit 1;
fi


NODE_MODULES_DIR_PATH=${1:-$(dirname $0)/../node_modules}
if [ -n "$NODE_MODULES_DIR_PATH" ]; then
    echo "Path to node_modules not specified, it must be given as first argument";
fi

FRONTEND_DIR="$NODE_MODULES_DIR_PATH/\@aliceo2/web-ui/Frontend/";

FILE_TO_BE_REPLACED_PATH="/js/src/renderer.js";
SRC_MOCHA_CODE=$(dirname $0)/web-ui-renderers.mocha.js;

cp -r $FRONTEND_DIR/js /js;
cp $SRC_MOCHA_CODE $FILE_TO_BE_REPLACED_PATH;
