#!/bin/bash
FQDN=$1

# make directories to work from
mkdir -p certs/{client-auth}

# Generate a client private key
openssl genrsa \
  -passout pass:secret \
  -out certs/client-auth/privkey.pem \
  2048


# Create a request from your Device, which your Root CA will sign
openssl req -new \
  -key certs/client-auth/privkey.pem \
  -out certs/tmp/client-csr.pem \
  -subj "/C=US/ST=Utah/L=Provo/O=ACME Tech Inc/CN=${FQDN}"

# Sign the request from Device with your Root CA
openssl x509 \
  -req -in certs/tmp/client-csr.pem \
  -CA certs/ca/my-root-ca.crt.pem \
  -CAkey certs/ca/my-root-ca.key.pem \
  -CAcreateserial \
  -out certs/client-auth/cert.pem \
  -days 500

# Create a public key, for funzies
# see https://gist.github.com/coolaj86/f6f36efce2821dfb046d
openssl rsa \
  -in certs/server/privkey.pem \
  -pubout -out certs/client/pubkey.pem

# Put things in their proper place
rsync -a certs/ca/my-root-ca.crt.pem certs/server/chain.pem
rsync -a certs/ca/my-root-ca.crt.pem certs/client/chain.pem
cat certs/server/cert.pem certs/server/chain.pem > certs/server/fullchain.pem
