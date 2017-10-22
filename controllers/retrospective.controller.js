Retrospective = require('../models/retrospective');
List = require('../models/list');
Template = require('../models/template');

exports.getRetrospective = function(req, res) {
    Retrospective.get(req.params.id, retrospective => {

        Retrospective.getFacilitador(req.params.id, facilitador => {

            Retrospective.getMembers(req.params.id, members => {
                retrospective.facilitador = facilitador;
                retrospective.members = members;
                return res.status(200).send(retrospective);
            });

        });

    });
};

exports.getAllListsFromRetrospective = function(req, res) {
    List.getAll(req.params.id, lists => {
        if (lists.forEach) {
            lists.forEach(function (list) {
                list.card = [];
            });
        }
        return res.status(200).send(lists);
    });
};

exports.getAllCards = function(req, res) {

    var cards = [{
        id: 1,
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit",
        votes: 4,
        user: {
            id: 1,
            name: 'Phelipe Rocha',
            image: 'https://s3-sa-east-1.amazonaws.com/pheliperocha/images/brand/PhelipeRocha-150.jpg'
        },
        list: {
            id: 1,
            title: 'Lista 1'
        },
        annotation: [{
            id: 1,
            description: "Donec pretium sagittis viverra. Vestibulum vestibulum luctus enim eu bibendum."
        }]
    }, {
        id: 5,
        description: "Cras eleifend eu enim ut ultrices",
        votes: 4,
        user: {
            id: 2,
            name: 'User 2',
            image: ''
        },
        list: {
            id: 2,
            title: 'Lista 2'
        },
        annotation: [{
            id: 2,
            description: "Vestibulum vestibulum luctus enim eu bibendum."
        },{
            id: 3,
            description: "Nulla eu massa et nulla tincidunt aliquam. Vestibulum vestibulum luctus enim eu bibendum."
        }]
    },{
        id: 4,
        description: "Nulla eu massa et nulla tincidunt aliquam",
        votes: 3,
        user: {
            id: 2,
            name: 'User 2',
            image: ''
        },
        list: {
            id: 2,
            title: 'Lista 2'
        },
        annotation: []
    }, {
        id: 2,
        description: "Donec pretium sagittis viverra. Vestibulum vestibulum luctus enim eu bibendum.",
        votes: 2,
        user: {
            id: 1,
            name: 'Phelipe Rocha',
            image: 'https://s3-sa-east-1.amazonaws.com/pheliperocha/images/brand/PhelipeRocha-150.jpg'
        },
        list: {
            id: 3,
            title: 'Lista 3'
        },
        annotation: []
    },{
        id: 3,
        description: "Fusce facilisis vel ipsum ut condimentum",
        votes: 0,
        user: {
            id: 1,
            name: 'Phelipe Rocha',
            image: 'https://s3-sa-east-1.amazonaws.com/pheliperocha/images/brand/PhelipeRocha-150.jpg'
        },
        list: {
            id: 2,
            title: 'Lista 2'
        },
        annotation: []
    }];

    return res.status(200).send(cards);
};

exports.getAllUsers = function(req, res) {
    var users = [{
        id: 1,
        name: 'Phelipe Rocha',
        image: 'aaa'
    },{
        id: 2,
        name: 'Nome Fictício',
        image: 'bbb'
    }];

    return res.status(200).send(users);
};

exports.createNewCard = function(req, res) {

    var info = req.body;

    var newCard = {
        id: 9,
        listId: info.listId,
        description: info.description,
        votes: 0,
        user: {
            id: info.user.id,
            name: 'Phelipe Rocha',
            image: 'https://s3-sa-east-1.amazonaws.com/pheliperocha/images/brand/PhelipeRocha-150.jpg'
        }
    };

    return res.status(200).send(newCard);
};

exports.createNewRetrospective = function(req, res) {
    var info = req.body;

    Retrospective.insert(info.title, info.context, info.templateId, info.facilitador.id, responseRetro => {
        Template.get(info.templateId, responseTemplate => {
            let obj = JSON.parse(responseTemplate.list);
            let lists = [];

            if (obj.forEach) {
                obj.forEach(function (list) {
                    lists.push([list.title, responseRetro.id]);
                });
                List.insert(lists, responseList => {});
            }
        });

        return res.status(200).send(responseRetro);
    });
};

exports.createNewList = function(req, res) {
    var info = req.body;

    var newList = {
        id: 4,
        title: '',
        order: 4,
        cards: []
    };

    return res.status(200).send(newList);
};

exports.createNewAnnotation = function(req, res) {
    var info = req.body;

    var newAnnotation = {
        id: 19,
        description: info.description,
        cardId: info.cardId
    };

    return res.status(200).send(newAnnotation);
};

exports.deleteCard = function (req, res) {
    return res.status(200).send(true);
};

exports.deleteList = function (req, res) {
    return res.status(200).send(true);
};

exports.updateRetrospective = function(req, res) {
    let data = req.body;

    Retrospective.update(data, req.params.id, response => {
        return res.status(200).send(response);
    });
};

exports.updateList = function(req, res) {
    var response = {
        updated: true,
        data: {}
    };

    return res.status(200).send(response);
};

exports.updateCard = function(req, res) {
    var response = {
        updated: true,
        data: {}
    };

    return res.status(200).send(response);
};