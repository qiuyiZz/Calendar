const mysql = require('mysql2');

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'lucy',
  password: 'lucy',
  database: 'events'
});

connection.connect(err => {
  if (err) {
    console.error('Connection failed:', err.stack);
    process.exit(1);
  }
  console.log('Connected to the database.');
});

module.exports = connection;
