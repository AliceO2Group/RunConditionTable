
DB_N=testsequelize;
    PSQLCMD="psql -h o2-rct_database -U postgres -d $DB_N "

if [ "$1" = '-d' ]; then
    echo "DB recreation"
    export PGPASSWORD=postgres;
    psql -h o2-rct_database -U postgres -c "create database $DB_N";
fi

$PSQLCMD -c "drop schema if exists public cascade; create schema public";


NODESCRIPT="
sq = require('sequelize');
sqi = new sq.Sequelize({host: 'o2-rct_database', password: 'postgres', username: 'postgres', database: '$DB_N', dialect: 'postgres'});
db = require('./app/lib/database');
"

node -e "$NODESCRIPT" -i 