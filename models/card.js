var db = require('../db');
var User = require('../models/user');

exports.get = function (cardId, cb) {
    let query = "SELECT cd_comentarios as id, comentario as description, cd_raia as listId, reuniao.cd_reuniao as retroId " +
                "FROM comentarios " +
                "JOIN reuniao ON reuniao.cd_reuniao = comentarios.cd_reuniao " +
                "WHERE cd_comentarios = ? ";

    db.query(query, cardId, function (err, card) {
        if(err) {
            return cb(err);
        }

        return cb(card[0]);
    });
};

exports.getAllFromList = function (listId, userId, cb) {
    let query = "SELECT comentarios.cd_comentarios as id, comentarios.comentario as description, comentarios.cd_usuario as userId, " +
        "  count(comentario_voto.cd_comentario_voto) as votes, MAX(comentario_voto.cd_usuario = " + userId + ") as voted " +
        "FROM comentarios " +
        "  LEFT JOIN comentario_voto ON comentarios.cd_comentarios = comentario_voto.cd_comentario " +
        "WHERE comentarios.cd_raia = ? and comentarios.cd_status = 1 " +
        "GROUP BY 1, 2, 3 ";

    db.query(query, listId, function (err, cards) {
        if(err) {
            cb(err);
            return;
        }

        if(cards) {
            var total = cards.length;
            var count = 0;

            for(var i = 0; i < total; i++) {
                (function(){
                    var cardEntry = cards[i];
                    var cardObject = {};
                    cardObject.entry = cardEntry;
                    cardObject.entry.listId = listId;

                    User.get(cards[i].userId, user => {
                        cardObject.entry.user = user;
                        count++;

                        if (count > total - 1) {
                            cb(cards);
                        }
                    });
                }(i));
            }

            if (total <= 0) {
                cb(cards);
            }
        }
    });
};

exports.insert = function(listId, userId, description, retroId, cb) {
    let comentario = {
        comentario: description,
        cd_raia: listId,
        cd_usuario: userId,
        cd_reuniao: retroId
    };

    let query = "INSERT INTO comentarios SET ?";

    db.query(query, comentario, function (err, results) {
        if (err) {
            return cb(err);
        }
        return cb({ id: results.insertId });
    });
};

exports.upvote = function(cardId, userId, cb) {
    let comentario_voto = {
        cd_comentario: cardId,
        cd_usuario: userId
    };

    let query = "INSERT INTO comentario_voto SET ?";

    db.query(query, comentario_voto, function (err, results) {
        if (err) {
            return cb(false);
        }

        if (results.affectedRows > 0) {
            cb(true);
        } else {
            cb(false);
        }
    });
};

exports.downvote = function(cardId, userId, cb) {
    let query = "DELETE FROM comentario_voto WHERE cd_comentario = ? AND cd_usuario = ?";

    db.query(query, [cardId, userId], function (err, results) {
        if (err) {
            return cb(err);
        }

        if (results.affectedRows > 0) {
            cb(true);
        } else {
            cb(false);
        }
    });
};

exports.update = function(data, cardId, cb) {
    let query = "UPDATE comentarios SET ? WHERE cd_comentarios = ?";
    let response = {
        updated: false,
        data: {}
    };

    db.query(query, [data, cardId], function (err, results) {
        if (err) {
            return cb(err);
        }

        if (results.affectedRows > 0) {
            response.updated = true;
        }

        return cb(response);
    });
};

exports.delete = function(cardId, cb) {
    let query = "DELETE FROM comentarios WHERE cd_comentarios = ?";

    db.query(query, [cardId], function (err, results) {
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