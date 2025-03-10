// MODULE = it's a JS file
// which exports out certain
// functions or variables

const mysql = require('mysql2/promise');

// create a connection pool
// previously - mysql.createConnection()
// why using a connection pool
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10, // max number of connections created
    queueLimit: 0 // inifinite client can be in the queue
});

// similiar to export default pool
module.exports = pool;