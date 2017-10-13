let Template = require('../models/template');

exports.getAllTemplates = function (req, res) {
    Template.getAllTemplates(result => {
        return res.status(200).send(result);
    });
};