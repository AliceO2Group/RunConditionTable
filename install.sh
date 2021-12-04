#!/bin/bash

SERVICENAME="run-condition-table"

service-systemd --add --service $SERVICENAME --cwd `pwd`/app --app `pwd`/app/index.js

systemctl daemon-reload
systemctl stop $SERVICENAME
systemctl start $SERVICENAME
systemctl status $SERVICENAME
