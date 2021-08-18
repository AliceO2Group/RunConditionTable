const { Client } = require("pg");

const client = new Client({
    user: 'crud-user',
    host: 'localhost',
    database: 'crud-db',
    password: 'crud-passwd',
    port: 5432,
})

client.connect();

module.exports = client;