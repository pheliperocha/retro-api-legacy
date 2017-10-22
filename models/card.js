var db = require('../db');
var User = require('../models/user');

exports.getAllFromList = function (listId, cb) {
    let query = "SELECT cd_comentarios as cd, comentario as description, cd_usuario as userId FROM comentarios WHERE cd_raia = ? and cd_status = 1";

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