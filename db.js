const mysql = require('mysql');

const connection = mysql.createConnection({
    host     : 'localhost',
    port     : 3306,
    user     : 'root',
    password : 'mysqlpw',
    database : 'retroAgeis'
});

connection.connect(function(err) {
    if(err) return console.log(err);
    console.log('conectou!');
});

module.exports = connection;