#!/bin/bash

# arguments syntax [--hostname <hostname>] [--port <port>]
# as in default config.js:
#     default hostname : localhost
#     default port : 8080

UNIT_NAME="run-condition-table"

REQUIRED_COMMANDS=(node npm)

for comm in "${REQUIRED_COMMANDS[@]}"; do
  echo $comm
  if ! command -v $comm &> /dev/null; then
    echo "could not find command "$comm
    exit
  fi
done


SERVICE_SYSTEMD="service-systemd"
if ! command -v $SERVICE_SYSTEMD &> /dev/null; then
    echo "could not find command "$SERVICE_SYSTEMD
    echo "permission for installation of npm package <service-systemd> [y/[n]]"
    read permission
    if [ "$permission" = "y" ]; then
      npm i -g $SERVICE_SYSTEMD || echo "Error occurred during installation of <$SERVICE_SYSTEMD>"; exit 1;
    else
      echo "permission for installation of <$SERVICE_SYSTEMD> denied"
      exit
    fi
fi


RCT_ETC_DIRECTORY=/etc/run-condition-table
rm -rf $RCT_ETC_DIRECTORY
mkdir $RCT_ETC_DIRECTORY
RCT_CONFIG_FILE="$RCT_ETC_DIRECTORY/rct.config"

INSTALLATION_DIRECTORY=/opt/RunConditionTable
rm -rf $INSTALLATION_DIRECTORY
mkdir $INSTALLATION_DIRECTORY
cp -r . $INSTALLATION_DIRECTORY

APP_CONFIG_FILE="$INSTALLATION_DIRECTORY/app/config.js"
for ((i=1; i<=$#; i++)); do
  next_i=$(($i+1))
  next_arg=${!next_i}
  if [ "${!i}" = "--port" ] && [[ "$next_arg" =~ ^[0-9]+$ ]]; then  ## TODO informing about errors
    sed -i -E "s/port *: *[0-9]+ *,/port: $next_arg,/" $APP_CONFIG_FILE
  fi
  if [ "${!i}" = "--hostname" ] && [[ -n "${!next_i}" ]]; then
      sed -i -E "s/hostname *: *.+ *,/hostname: $next_arg,/" $APP_CONFIG_FILE
  fi
done


cd "$INSTALLATION_DIRECTORY/app" && npm install ; cd -

service-systemd --add --service $UNIT_NAME --cwd "$INSTALLATION_DIRECTORY/app" --app "$INSTALLATION_DIRECTORY/app/index.js"

echo "UnitName=$UNIT_NAME" > $RCT_CONFIG_FILE
chmod -w $RCT_CONFIG_FILE;

systemctl daemon-reload
systemctl stop $UNIT_NAME
systemctl start $UNIT_NAME
systemctl status $UNIT_NAME -n3

echo "installed in: "$INSTALLATION_DIRECTORY
echo "metadata in: "$RCT_ETC_DIRECTORY