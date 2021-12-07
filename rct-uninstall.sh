#!/bin/bash


RCT_ETC_DIRECTORY=/etc/run-condition-table/
RCT_CONFIG_FILE=$RCT_ETC_DIRECTORY"rct.config"

UNIT_NAME=$(cat $RCT_CONFIG_FILE | grep "UnitName" | awk -F= '{print $2}')

systemctl stop "$UNIT_NAME"
systemctl disable "$UNIT_NAME"
rm /etc/systemd/system/"$UNIT_NAME".service
rm -rf $RCT_CONFIG_FILE