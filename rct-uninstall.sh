#!/bin/bash
#/**
# * @license
# * Copyright 2019-2020 CERN and copyright holders of ALICE O2.
# * See http://alice-o2.web.cern.ch/copyright for details of the copyright holders.
# * All rights not expressly granted are reserved.
# *
# * This software is distributed under the terms of the GNU General Public
# * License v3 (GPL Version 3), copied verbatim in the file "COPYING".
# *
# * In applying this license CERN does not waive the privileges and immunities
# * granted to it by virtue of its status as an Intergovernmental Organization
# * or submit itself to any jurisdiction.
# */





# remove everything related to RCT

RCT_ETC_DIRECTORY=/etc/run-condition-table
RCT_CONFIG_FILE="$RCT_ETC_DIRECTORY/rct.config"

UNIT_NAME=$(cat $RCT_CONFIG_FILE | grep "UnitName" | awk -F= '{print $2}')

systemctl stop "$UNIT_NAME"
systemctl disable "$UNIT_NAME"
rm /etc/systemd/system/"$UNIT_NAME".service
rm -rf $RCT_CONFIG_FILE