const {Client} = require('pg')

const client = new Client({
    host: "localhost",
    user: "postgres",
    port: 5432,
    password: "Mehedy@72759",
    database: "postgres"
})

module.exports = client