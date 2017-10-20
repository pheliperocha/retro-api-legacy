var db = require('../db');

exports.insert = function(lists, cb) {
    let query = "INSERT INTO raia (nome, cd_reuniao) VALUES ?";

    db.query(query, [lists], function (err, results) {
        if (err) {
            cb(err);
        }
        cb({ id: results.insertId.toString() });
    });
};
