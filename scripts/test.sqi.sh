
if [ "$1" = '-d' ]; then
    echo "DB recreation"
    export PGPASSWORD=postgres;
    DB_N=testsequelize
    psql -h o2-rct_database -U postgres -c "create database $DB_N";

    PSQLCMD="psql -h o2-rct_database -U postgres -d $DB_N "
    $PSQLCMD -c "drop schema if exists public; create schema public";
fi


NODESCRIPT="
sq = require('sequelize');
sqi = new sq.Sequelize({host: 'o2-rct_database', password: 'postgres', username: 'postgres', database: '$DB_N', dialect: 'postgres'});
db = require('./app/lib/database');
"

node -e "$NODESCRIPT" -i 