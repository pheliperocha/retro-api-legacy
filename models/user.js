var db = require('../db');

exports.test = function(user, text, cb) {
    db.query("SELECT * FROM usuario", function (error, results, fields) {
        db.end();
        console.log(results);
    });
};