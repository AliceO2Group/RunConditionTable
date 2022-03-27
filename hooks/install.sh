#!/bin/bash


if ! ls .git &> /dev/null; then 
    echo "run this script from project root dricetory !" >&2
    exit 1
fi

HOOKS_DIR="./hooks"
HOOKS_INSTALATION_DIRECTORY="./.git/hooks"

for dir in "$HOOKS_DIR/*/"; do
    echo $dir
    HOOK_TYPE=$(echo $dir | awk -F'/' '{print $3}')
    echo $HOOK_TYPE
    for ss in "$dir/*"; do
        TMP_SCRIPT="$HOOKS_DIR/$HOOK_TYPE.sh"
        TARGET_SCRIPT="$HOOKS_INSTALATION_DIRECTORY/$HOOK_TYPE"

        echo "" > $TMP_SCRIPT
        chmod +x $TMP_SCRIPT
        while read line; do
            echo $line >> $TMP_SCRIPT
        done < $ss

        cp $TMP_SCRIPT $TARGET_SCRIPT
    done
done