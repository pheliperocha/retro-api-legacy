var db = require('../db');

exports.getAllTemplates = function (cb) {
    let query = "SELECT cd_template as id, nome as name, 'http://placehold.it/200x200' as image FROM template WHERE cd_status = 1";

    db.query(query, function (err, results) {
        if (err) {
            cb(err);
        }
        cb(results);
    });
};