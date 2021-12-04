#!/bin/bash

UNIT_NAME="run-condition-table"

REQUIRED_COMMANDS=(node npm)

for comm in "${REQUIRED_COMMANDS[@]}"; do
  echo $comm
  if ! command -v node &> /dev/null; then
    echo "could not find command "$comm
    exit
  fi
done

SERVICE_SYSTEMD=service-systemd

if ! command -v $SERVICE_SYSTEMD &> /dev/null; then
    echo "could not find command "$SERVICE_SYSTEMD
    echo "permission for installation of npm package <service-systemd> [y/[n]]"
    read permission
    if [ "$permission" = "y" ]; then
      npm i -g $SERVICE_SYSTEMD
    else
      echo "installation can not be performed"
      exit
    fi
fi

service-systemd --add --service $UNIT_NAME --cwd `pwd`/app --app `pwd`/app/index.js

UNITNAME_FILE="unit_name.txt"
echo $UNIT_NAME > $UNITNAME_FILE
chmod -w $UNITNAME_FILE;

systemctl daemon-reload
systemctl stop $UNIT_NAME
systemctl start $UNIT_NAME
systemctl status $UNIT_NAME
