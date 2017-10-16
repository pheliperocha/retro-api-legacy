var db = require('../db');

exports.myRetrospectives = function (userId, cb) {
    let query = "SELECT cd_reuniao as id, nome as title, contexto as context, image, dh_timestamp as date FROM reuniao WHERE cd_usuario = ?";

    db.query(query, [userId], function (err, results) {
        if (err) {
            cb(err);
        }
        cb(results);
    });
};
