#!/bin/bash

HOST=$1
PORT=$2
TIMEOUT_SEC=$3
CMD_ARGS="${@:5}"

usage() {
    cat << USAGE >&2
Usage:
    $(basename $0) HOST PORT TIMEOUT_SECOND -- CMD_ARGS
    CMD_ARGS is executed if HOST:PORT is reachable
USAGE
}

if [ -z "$HOST" ] || [ -z "$PORT" ] || [ -z "$TIMEOUT_SEC" ] || [ -z "$CMD_ARGS" ]; then
    usage
    exit 1
fi

# TODO args parsing

host_scan() {
    HOST=$1
    PORT=$2
    TIMEOUT_SEC=$3
    
    while ! timeout $TIMEOUT_SEC\s nc -z $HOST $PORT; do
        sleep 0.1s;
    done

    echo true;
}
export -f host_scan



SUCCESS=$(timeout $TIMEOUT_SEC\s bash -c "host_scan $HOST $PORT $TIMEOUT_SEC")
echo $?
if [ "$SUCCESS" = "true" ]; then
    echo "$HOST:$PORT is reachable"
    echo running "$CMD_ARGS"
    $CMD_ARGS
    exit $?;
else
    echo "cannot reach $HOST:$PORT"
    exit 1;
fi