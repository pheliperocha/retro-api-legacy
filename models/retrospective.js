var db = require('../db');
var Annotation = require('../models/annotation');

exports.get = function (id, cb) {
    let query = "SELECT cd_reuniao as id, nome as title, contexto as context, status_reuniao as state, dh_timestamp as date, pin, image FROM reuniao WHERE cd_reuniao = ?";

    db.query(query, id, function (err, results) {
        if (err) {
            cb(err);
        }
        cb(results[0]);
    });
};

exports.getFacilitador = function (id, cb) {
    let query = "SELECT usuario.cd_usuario as id, usuario.nome as name, usuario.image\n" +
        "FROM reuniao\n" +
        "  JOIN usuario ON usuario.cd_usuario = reuniao.cd_usuario\n" +
        "WHERE cd_reuniao = ?";

    db.query(query, id, function (err, results) {
        if (err) {
            cb(err);
        }
        cb(results[0]);
    });
};

exports.getMembers = function (id, cb) {
    let query = "SELECT usuario.cd_usuario as id, usuario.nome as name, usuario.image\n" +
        "FROM reuniao\n" +
        "  JOIN reuniao_membro ON reuniao_membro.cd_usuario = reuniao.cd_usuario AND reuniao_membro.cd_reuniao = reuniao.cd_reuniao\n" +
        "  JOIN usuario ON reuniao_membro.cd_usuario = usuario.cd_usuario\n" +
        "WHERE reuniao.cd_reuniao = ?";

    db.query(query, id, function (err, results) {
        if (err) {
            cb(err);
        }
        cb(results);
    });
};

exports.getCards = function (retroId, cb) {
    let query = "SELECT comentarios.cd_comentarios as id, comentarios.comentario as description, comentarios.cd_usuario as userId, " +
    "   comentarios.cd_raia as listId, raia.nome as listTitle, usuario.cd_usuario as userId, usuario.nome as userName, usuario.image as userImage, count(comentario_voto.cd_comentario_voto) as votes " +
    "FROM comentarios " +
    "   LEFT JOIN comentario_voto ON comentarios.cd_comentarios = comentario_voto.cd_comentario " +
    "   LEFT JOIN raia ON comentarios.cd_raia = raia.cd_raia " +
    "   LEFT JOIN usuario ON comentarios.cd_usuario = usuario.cd_usuario " +
    "WHERE comentarios.cd_reuniao = ? " +
    "GROUP BY 1, 2, 3, 4, 5 " +
    "ORDER BY votes DESC";

    db.query(query, retroId, function (err, cards) {
        if(err) {
            return cb(err);
        }

        if(cards) {
            var total = cards.length;
            var count = 0;

            for(var i = 0; i < total; i++) {
                (function(){
                    var cardEntry = cards[i];
                    var cardObject = {};
                    cardObject.entry = cardEntry;
                    cardObject.entry.retroId = retroId;
                    cardObject.entry.list = {
                        id: cards[i].listId,
                        title: cards[i].listTitle
                    };
                    cardObject.entry.user = {
                        id: cards[i].userId,
                        name: cards[i].userName,
                        image: cards[i].userImage,
                    };

                    delete cards[i].listId;
                    delete cards[i].listTitle;
                    delete cards[i].userId;
                    delete cards[i].userName;
                    delete cards[i].userImage;

                    Annotation.get(cards[i].id, annotation => {
                        cardObject.entry.annotation = annotation;
                        count++;

                        if (count > total - 1) {
                            return cb(cards);
                        }
                    });
                }(i));
            }

            if (total <= 0) {
                return cb(cards);
            }
        }
    });
};

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
        cb({ id: results.insertId.toString() });
    });
};

exports.update = function(data, retrospectiveId, cb) {
    let query = "UPDATE reuniao SET ? WHERE cd_reuniao = ?";
    let response = {
        updated: false,
        data: {}
    };

    db.query(query, [data, retrospectiveId], function (err, results) {
        if (err) {
            return cb(err);
        }

        if (results.affectedRows > 0) {
            response.updated = true;
        }

        cb(response);
    });
};