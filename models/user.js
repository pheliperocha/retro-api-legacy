var db = require('../db');

exports.myRetrospectives = function (userId, cb) {
    let query = "SELECT cd_reuniao as id, nome as title, contexto as context, '' as image, dh_timestamp as date FROM reuniao WHERE cd_usuario = ?";

    var test = db.query(query, [userId], function (err, results) {
        if (err) {
            cb(err);
        }

        cb(results);
    });
};

exports.test = function(user, text, cb) {
    db.query("SELECT * FROM usuario", function (error, results, fields) {
        db.end();
        console.log(results);
    });
};