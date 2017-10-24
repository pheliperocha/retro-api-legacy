var db = require('../db');

exports.get = function (cardId, cb) {
    let query = "SELECT cd_anotacao_acao as id, descricao as description FROM anotacao_acao WHERE cd_comentario = ? AND cd_status = 1";

    db.query(query, [cardId], function (err, results) {
        if (err) {
            return cb(err);
        }
        return cb(results);
    });
};

exports.insert = function(description, cardId, cb) {
    let anotacao_acao = {
        descricao: description,
        cd_comentario: cardId
    };

    let query = "INSERT INTO anotacao_acao SET ?";

    db.query(query, anotacao_acao, function (err, results) {
        if (err) {
            return cb(results, err);
        }
        return cb({ id: results.insertId }, null);
    });
};