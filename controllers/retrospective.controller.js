Retrospective = require('../models/retrospective');
List = require('../models/list');
Template = require('../models/template');
Card = require('../models/card');
User = require('../models/user');
Annotation = require('../models/annotation');

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

exports.getRetrospectiveByPin = function(req, res) {
    Retrospective.getByPin(req.params.pin, retrospective => {

        Retrospective.getFacilitador(retrospective.id, facilitador => {

            Retrospective.getMembers(retrospective.id, members => {
                retrospective.facilitador = facilitador;
                retrospective.members = members;
                return res.status(200).send(retrospective);
            });

        });

    });
};

exports.getAllListsFromRetrospective = function(req, res) {
    List.getAll(req.params.id, function(err, lists) {
        if(err) {
            return res.status(500).json('Error');
        }

        if(lists) {
            var total = lists.length;
            var count = 0;

            for(var i = 0; i < lists.length; i++) {
                (function(){
                    var listEntry = lists[i];
                    var listObject = {};
                    listObject.entry = listEntry;

                    Card.getAllFromList(lists[i].id, cards => {
                        listObject.entry.cards = cards;
                        count++;

                        if (count > total - 1) {
                            return res.status(200).json(lists);
                        }
                    });
                }(i));
            }

            if (total <= 0) {
                return res.status(200).json(lists);
            }
        }
    });
};

exports.getAllCards = function(req, res) {
    Retrospective.getCards(req.params.id, cards => {
        return res.status(200).send(cards);
    });
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

exports.createNewCard = function(req, res, io) {

    var info = req.body;

    Card.insert(info.listId, info.userId, info.description, info.retroId, cardResponse => {
        User.get(info.userId, userResponse => {

            var newCard = {
                id: cardResponse.id,
                listId: info.listId,
                description: info.description,
                votes: 0,
                user: {
                    id: info.userId,
                    name: userResponse.name,
                    image: userResponse.image
                }
            };

            io.to(info.retroId).emit('new_card', newCard);

            return res.status(200).send(newCard);

        });
    });
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
    let lists = [[req.body.title, req.body.retroId]];

    List.insert(lists, responseList => {
        return res.status(200).send(responseList);
    });
};

exports.createNewAnnotation = function(req, res) {
    var info = req.body;

    Annotation.insert(info.description, info.cardId, (annotation, err) => {
        if (err) {
            return res.status(500).send(err);
        }

        var newAnnotation = {
            id: annotation.id,
            description: info.description,
            cardId: info.cardId
        };

        return res.status(200).send(newAnnotation);
    });
};

exports.addNewMember = function(req, res) {
    var info = req.body;

    Retrospective.insertMember(info.retroId, info.userId, response => {
        return res.status(200).send(response);
    });
};

exports.removeMember = function(req, res) {
    Retrospective.deleteMember(req.params.retroId, req.params.userId, response => {
        return res.status(200).send(response);
    });
};

exports.deleteCard = function (req, res) {
    Card.delete(req.params.id, response => {
        return res.status(200).send(response);
    });
};

exports.deleteList = function (req, res) {
    List.delete(req.params.id, response => {
        return res.status(200).send(response);
    });
};

exports.updateRetrospective = function(req, res) {
    let data = req.body;

    Retrospective.update(data, req.params.id, response => {
        return res.status(200).send(response);
    });
};

exports.updateList = function(req, res) {
    let data = req.body;

    List.update(data, req.params.id, response => {
        return res.status(200).send(response);
    });
};

exports.updateCard = function(req, res, io) {
    let data = req.body;

    Card.update(data, req.params.id, response => {
        Card.get(req.params.id, card => {

            io.to(card.retroId).emit('updated_card', card);

            return res.status(200).send(response);
        });
    });
};

exports.cardUpvote = function (req, res, io) {
    var info = req.body;

    Card.upvote(req.params.id, info.userId, cardVoted => {
        Card.get(req.params.id, card => {
            if (cardVoted) {
                io.to(card.retroId).emit('upvoted_card', card);
            }
            return res.status(200).send(cardVoted);
        });
    });
};

exports.cardDownvote = function (req, res, io) {
    Card.downvote(req.params.cardId, req.params.userId, cardVoted => {
        Card.get(req.params.cardId, card => {
            if (cardVoted) {
                io.to(card.retroId).emit('downvoted_card', card);
            }
            return res.status(200).send(cardVoted);
        });
    });
};

exports.getLinkedinToken = function (req, res, io) {
    let code = req.query.code;
    let state = req.query.state;

    io.to(state).emit('linkedinToken', code);

    res.writeHead(200, {'Content-Type': 'text/html'});
    res.write('<script>this.window.close()</script>');
    res.end();
};