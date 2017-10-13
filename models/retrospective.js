var db = require('../db');

exports.insert = function(title, context, templateId, userId, cb) {
    let reuniao = {
        nome: title,
        contexto: context,
        cd_usuario: userId,
        cd_template: templateId
    };

    let query = "INSERT INTO reuniao SET ?";

    db.query(query, reuniao, function (err, results) {
        if (err) {
            cb(err);
        }
        cb({ id: results.insertId });
    });
};