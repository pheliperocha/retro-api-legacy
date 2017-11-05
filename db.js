const mysql = require('mysql');

const connection = mysql.createConnection({
    host     : process.env.DB_HOST,
    port     : 3306,
    user     : process.env.DB_USER,
    password : process.env.DB_PASS,
    database : process.env.DB_BASE,
    multipleStatements: true
});

connection.connect(function(err) {
    if(err) return console.log(err);
    console.log('conectou!');
});

function execSQLQuery(sqlQry, value, cb) {
    connection.query(sqlQry, [values], function(error, results, fields) {
        connection.end();
        console.log('executou!');

        cb(error, results, fields);
    });
};

myUser = {

    getUserByEmail: function(email, cb) {
        execSQLQuery('SELECT * FROM USUARIO WHERE EMAIL = ?', [email], cb);
    },

    getAll: function(cb) {
        execSQLQuery('SELECT * FROM USUARIO', [], cb);
    }
};

// myUser.getUserByEmail('leonardomarinho12@gmail.com', function (error, results, fields) {
//     console.log(results);
// });

module.exports = connection;