var db = require('../db');

exports.get = function (id, cb) {
    let query = "SELECT cd_reuniao as id, nome as title, contexto as context, status_reuniao as state, dh_timestamp as date, pin, '' as image FROM reuniao WHERE cd_reuniao = ?";

    db.query(query, id, function (err, results) {
        if (err) {
            cb(err);
        }
        cb(results[0]);
    });
};

exports.getFacilitador = function (id, cb) {
    let query = "SELECT usuario.cd_usuario as id, usuario.nome as name, '' as image\n" +
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
    let query = "SELECT usuario.cd_usuario as id, usuario.nome as name, '' as image\n" +
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