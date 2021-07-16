const {Client} = require('pg');
const client = new Client({
    user: 'postgres',
    host: 'localhost',
    database: 'herbs',
    password: 'passwordpg',
    port: 5432,
});

async function select(command) {
    await client.connect();
    const res = await client.query(command);
    await client.end();
    return res;
}

select('SELECT * FROM herbs;')
    .then(res => {
        console.log(res.rows);
    }).catch(e => {
    console.log(e.message);
});

