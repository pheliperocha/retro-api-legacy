Retrospective = require('../models/retrospective');

exports.getRetrospective = function(req, res) {

    var retrospective = {
        id: req.params.id,
        title: "Retrospectiva número 3",
        context: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed vel condimentum justo. Nam facilisis arcu tincidunt erat hendrerit, vitae auctor nisl mollis. Pellentesque pellentesque, sapien eget mollis sagittis, nunc velit semper elit, at sollicitudin quam nisi vestibulum tellus. ",
        state: 1,
        date: '30/09/2017',
        image: '',
        pin: 54523,
        facilitador: {
            id: 1,
            name: 'Phelipe Rocha',
            image: ''
        },
        members: [
            {
                id: 1,
                name: 'Membro 1',
                image: ''
            },
            {
                id: 2,
                name: 'Membro 2',
                image: ''
            },
            {
                id: 3,
                name: 'Membro 3',
                image: ''
            },
            {
                id: 4,
                name: 'Membro 4',
                image: ''
            }
        ]
    };

    return res.status(200).send(retrospective);
};

exports.getAllLists = function(req, res) {

    var lists = [{
        id: 1,
        title: "Lista 1",
        order: 1,
        cards: [
            {
                id: 1,
                listId: 1,
                description: "Feedback 1 da lista 1 com 3 votos",
                votes: 3,
                userId: 1
            }, {
                id: 5,
                listId: 1,
                description: "Último feedback da primeira lista com 2 votos",
                votes: 2,
                userId: 2
            }
        ]
    },{
        id: 2,
        title: "Lista 2",
        order: 2,
        cards: [
            {
                id: 4,
                listId: 2,
                description: "Feedback 4 da lista 2 com 1 voto",
                votes: 1,
                userId: 2
            }, {
                id: 2,
                listId: 2,
                description: "Feedback 2 da lista 2 com 3 votos",
                votes: 3,
                userId: 1
            }
        ]
    },{
        id: 3,
        title: "Lista 3",
        order: 3,
        cards: [
            {
                id: 3,
                listId: 3,
                description: "Feedback 3 da lista 3 com 0 votos",
                votes: 0,
                userId: 1
            }
        ]
    }];

    return res.status(200).send(lists);
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
        userId: info.userId
    };

    return res.status(200).send(newCard);
};

exports.createNewRetrospective = function(req, res) {
    var info = req.body;

    var newRetrospective = {
        id: 7,
        title: info.title,
        context: info.context,
        state: 1,
        date: Date(),
        image: null,
        pin: null
    };

    return res.status(200).send(newRetrospective);
};

exports.deleteCard = function (req, res) {
    return res.status(200).send(true);
};

exports.deleteList = function (req, res) {
    return res.status(200).send(true);
};

exports.updateRetrospective = function(req, res) {
    return res.status(200).send(true);
};

exports.updateList = function(req, res) {
    return res.status(200).send(true);
};