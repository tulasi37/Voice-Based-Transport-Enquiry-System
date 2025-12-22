const mysql = require('mysql2');

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Kalyan@1438', // Enter your MySQL password here
    database: 'transport_db'
});

db.connect((err) => {
    if (err) throw err;
    console.log('Database Connected!');
});

module.exports = db;

