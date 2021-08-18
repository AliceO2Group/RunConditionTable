const {Client} = require('pg')

const client = new Client({
    user: 'rct-user',
    host: 'localhost',
    database: 'rct-db',
    password: 'rct-passwd',
    port: 5432,
})

async function select(command) {
    await client.connect();
    console.log("Connected successfully! :)");
    const res = await client.query(command);
    await client.end();
    return res;
}

select('SELECT * FROM periods;')
    .then(res => {
        console.table(res.rows);
    }).catch(e => {
    console.log(e.message);
});
