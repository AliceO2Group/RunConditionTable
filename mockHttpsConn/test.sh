#!/bin/bash

bash make-root-ca-and-certificates.sh 'localhost'
echo ""

echo ""
node ./serve.js 8043 &
NODE_PID=$!
sleep 1

echo ""
echo ""
node ./request.js 8043 'localhost'
echo -n " - without warnings, love node.js' https"
echo ""
sleep 1

echo ""
curl https://localhost:8043 \
  --cacert certs/client/chain.pem
echo -n " - without warnings, love cURL"
echo ""
sleep 1

kill ${NODE_PID}
echo ""
