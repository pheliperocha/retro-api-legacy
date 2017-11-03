var db = require('../db');

exports.myRetrospectives = function (userId, cb) {
    let query = "SELECT cd_reuniao as id, reuniao.nome as title, contexto as context, template.image, reuniao.dh_timestamp as date " +
        "FROM reuniao " +
        "JOIN template ON reuniao.cd_template = template.cd_template " +
        "WHERE reuniao.cd_usuario = ? ";

    db.query(query, [userId], function (err, results) {
        if (err) {
            cb(err);
        }
        cb(results);
    });
};

exports.get = function (userId, cb) {
    let query = "SELECT cd_usuario as id, nome as name, email, image FROM usuario WHERE cd_usuario = ? AND cd_status = 1";

    db.query(query, [userId], function (err, results) {
        if (err) {
            cb(err);
        }
        cb(results[0]);
    });
};

exports.getByEmail = function (email, cb) {
    let query = "SELECT cd_usuario as id, nome as name, email, image FROM usuario WHERE email = ? AND cd_status = 1";

    db.query(query, [email], function (err, results) {
        if (err) {
            cb(err);
        }
        cb(results[0]);
    });
};

exports.insert = function(name, email, image, linkedinId, cb) {
    let user = {
        nome: name,
        email: email,
        image: image,
        cd_linkedin: linkedinId
    };

    let query = "INSERT INTO usuario SET ?";

    db.query(query, user, function (err, results) {
        if (err) {
            cb(err);
        }

        user.id = results.insertId.toString();
        cb(user);
    });
};