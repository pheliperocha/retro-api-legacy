var db = require('../db');
var User = require('../models/user');

exports.getAllFromList = function (listId, cb) {
    let query = "SELECT comentarios.cd_comentarios as cd, comentarios.comentario as description, comentarios.cd_usuario as userId, " +
        "  count(comentario_voto.cd_comentario_voto) as votes " +
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