#!/bin/bash
# curl --insecure --socks5-hostname localhost:12345 https://ali-bookkeeping.cern.ch/api/runs
curl \
    --insecure \
    --socks5-hostname localhost:12345 \
    --cert-type PEM --cert $CERT_PATH \
    https://alimonitor.cern.ch/production/raw.jsp?res_path=json

https://stackoverflow.com/questions/39143689/access-hosts-ssh-tunnel-from-docker-container
curl --insecure --socks5-hostname 172.17.0.1:12346 http://rct-bookkeeping.cern.ch:4000/api/runs
ssh -L 172.17.0.1:12346:localhost:12345 -D 12345 ldubiel@lxplus.cern.ch
