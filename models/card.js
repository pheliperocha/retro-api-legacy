var db = require('../db');

exports.insert = function(listId, userId, description, cb) {
    let comentario = {
        comentario: description,
        cd_raia: listId,
        cd_usuario: userId
    };

    let query = "INSERT INTO comentarios SET ?";

    db.query(query, comentario, function (err, results) {
        if (err) {
            cb(err);
        }
        cb({ id: results.insertId.toString() });
    });
};