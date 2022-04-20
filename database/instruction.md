# preconditions

1. postgres linux user
2. sudo access

## create database

sudo -H -u postgres bash -c "./setup-db.sh"

## create database and fill with test data

sudo -H -u postgres bash -c "./setup-db.sh --dev"
