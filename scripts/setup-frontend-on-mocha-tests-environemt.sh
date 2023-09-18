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


NODE_MODULES_DIR_PATH=${1:-$(dirname $(realpath $0) )/../node_modules}
if [ -z "$NODE_MODULES_DIR_PATH" ]; then
    echo "Path to node_modules not specified, it must be given as first argument";
fi

FRONTEND_DIR="$NODE_MODULES_DIR_PATH/@aliceo2/web-ui/Frontend/";

SRC_MOCHA_CODE=$(dirname $0)/web-ui-renderers.mocha.js;



NODEJS_WINDOW_CODE="
// Provide pseudo window object with uploaded mithril
const m = () => ({});
m.render = () => ({});
const window = {
    location: new URL('http://localhost:8081/?personid=0&name=_&token=_&username=_&access=_'),
    history: {
        replaceState: () => ({}),
    },
    m,
    requestAnimationFrame: () => ({}),
    cancelAnimationFrame: () => ({}),
};
"

rm -rf /js
cp -r $FRONTEND_DIR/js /js;

TARGET_SRC_DIR=/js/src/
for fp in $(ls $TARGET_SRC_DIR ); do
    FPATH=$TARGET_SRC_DIR/$fp;
    echo "$NODEJS_WINDOW_CODE" $'\n' "$(cat $FPATH)" > $FPATH;
done;

FILE_TO_BE_REPLACED_PATH="/js/src/renderer.js";
echo "$( cat "$FILE_TO_BE_REPLACED_PATH" | grep -v "import '/mithril/mithril.min.js'" )" > "$FILE_TO_BE_REPLACED_PATH";
