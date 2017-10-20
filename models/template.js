var db = require('../db');

exports.getAllTemplates = function (cb) {
    let query = "SELECT cd_template as id, nome as name, image FROM template WHERE cd_status = 1";

    db.query(query, function (err, results) {
        if (err) {
            cb(err);
        }
        cb(results);
    });
};

exports.get = function (templateId, cb) {
    let query = "SELECT cd_template as id, nome as name, image, list FROM template WHERE cd_status = 1 and cd_template = ?";

    db.query(query, templateId, function (err, results) {
        if (err) {
            cb(err);
        }
        cb(results[0]);
    });
};