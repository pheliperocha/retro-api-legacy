var db = require('../db');

exports.getAll = function (retroId, cb) {
    let query = "SELECT cd_raia as id, nome as title FROM raia WHERE cd_reuniao = ?";

    db.query(query, retroId, function (err, results) {
        if (err) {
            cb(err, null);
            return;
        }
        cb(null, results);
    });
};

exports.insert = function(lists, cb) {
    let query = "INSERT INTO raia (nome, cd_reuniao) VALUES ?";

    db.query(query, [lists], function (err, results) {
        if (err) {
            cb(err);
        }
        cb({ id: results.insertId });
    });
};

exports.update = function(data, listId, cb) {
    let query = "UPDATE raia SET ? WHERE cd_raia = ?";
    let response = {
        updated: false,
        data: {}
    };

    db.query(query, [data, listId], function (err, results) {
        if (err) {
            cb(err);
        }

        if (results.affectedRows > 0) {
            response.updated = true;
        }

        cb(response);
    });
};

exports.delete = function(listId, cb) {
    let query = "DELETE FROM raia WHERE cd_raia = ?";

    db.query(query, [listId], function (err, results) {
        if (err) {
            cb(err);
        }

        if (results.affectedRows > 0) {
            cb(true);
        } else {
            cb(false);
        }
    });
};