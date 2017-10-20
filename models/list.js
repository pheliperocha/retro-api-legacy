var db = require('../db');

exports.getAll = function (id, cb) {
    let query = "SELECT cd_raia as id, nome as title FROM raia WHERE cd_reuniao = ?";

    db.query(query, id, function (err, results) {
        if (err) {
            cb(err);
        }
        cb(results);
    });
};

exports.insert = function(lists, cb) {
    let query = "INSERT INTO raia (nome, cd_reuniao) VALUES ?";

    db.query(query, [lists], function (err, results) {
        if (err) {
            cb(err);
        }
        cb({ id: results.insertId.toString() });
    });
};
