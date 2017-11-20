var db = require('../db');

exports.get = function (cardId, cb) {
    let query = "SELECT cd_anotacao_acao as id, descricao as description FROM anotacao_acao WHERE cd_comentario = ? AND cd_status = 1";

    db.query(query, [cardId], function (err, annotations) {
        if (err) {
            return cb(err);
        }

        if(annotations) {
            var total = annotations.length;
            var count = 0;

            for(var i = 0; i < total; i++) {
                (function(){
                    var annotationEntry = annotations[i];
                    var annotationObject = {};
                    annotationObject.entry = annotationEntry;

                    User.getResponsibles(annotations[i].id, users => {
                        annotationObject.entry.responsibles = users;
                        count++;

                        if (count > total - 1) {
                            return cb(annotations);
                        }
                    });
                }(i));
            }

            if (total <= 0) {
                return cb(annotations);
            }
        }
    });
};

exports.getByResponsible = function (retroId, userId, cb) {
    let query = "SELECT anotacao_acao.cd_anotacao_acao as id, descricao as description " +
                "FROM anotacao_acao " +
                " JOIN acao_responsavel ON anotacao_acao.cd_anotacao_acao = acao_responsavel.cd_anotacao_acao " +
                " JOIN comentarios ON comentarios.cd_comentarios = cd_comentario " +
                "WHERE comentarios.cd_reuniao = ? AND acao_responsavel.cd_usuario = ? AND anotacao_acao.cd_status = 1 " +
                "ORDER BY anotacao_acao.dh_timestamp DESC;";

    db.query(query, [retroId, userId], function (err, annotations) {
        if (err) {
            return cb(err);
        }

        if(annotations) {
            var total = annotations.length;
            var count = 0;

            for(var i = 0; i < total; i++) {
                (function(){
                    var annotationEntry = annotations[i];
                    var annotationObject = {};
                    annotationObject.entry = annotationEntry;

                    User.getResponsibles(annotations[i].id, users => {
                        annotationObject.entry.responsibles = users;
                        count++;

                        if (count > total - 1) {
                            return cb(annotations);
                        }
                    });
                }(i));
            }

            if (total <= 0) {
                return cb(annotations);
            }
        }
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

exports.insertResponsible = function(annotationId, userId, cb) {
    let acao_responsavel = {
        cd_anotacao_acao: annotationId,
        cd_usuario: userId
    };

    let query = "INSERT INTO acao_responsavel SET ?";

    db.query(query, acao_responsavel, function (err, results) {
        if (err) {
            return cb(results, err);
        }

        if (results.insertId > 0)
        return cb(true, err);
    });
};

exports.deleteResponsible = function(annotationId, userId, cb) {
    let query = "DELETE FROM acao_responsavel WHERE cd_anotacao_acao = ? AND cd_usuario = ?";

    db.query(query, [annotationId, userId], function (err, results) {
        if (err) {
            return cb(err);
        }

        if (results.affectedRows > 0) {
            return cb(true);
        } else {
            return cb(false);
        }
    });
};