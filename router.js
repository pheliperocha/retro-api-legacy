var express = require('express');
var router = new express.Router();
var authGuard = require('./middlewares/auth_guard');
var jwt = require('jwt-simple');
var moment = require('moment');
var config = require('./config');

var userController = require('./controllers/user.controller');
var retroController = require('./controllers/retrospective.controller');
var templateController = require('./controllers/template.controller');

var returnRouter = function(io) {
    router.get('/facilitador/:userId/retrospective', authGuard, userController.getAllRetrospectives);
    router.get('/retrospective/:id', authGuard, retroController.getRetrospective);
    router.get('/retrospective/pincode/:pin', authGuard, retroController.getRetrospectiveByPin);
    router.get('/retrospective/:id/list', authGuard, retroController.getAllListsFromRetrospective);
    router.get('/retrospective/:id/card', authGuard, retroController.getAllCards);
    router.get('/retrospective/:id/user', authGuard, retroController.getAllUsers);
    router.get('/template', templateController.getAllTemplates);
    router.get('/getLinkedinToken/', (req, res) => {
        retroController.getLinkedinToken(req, res, io);
    });

    router.post('/auth/linkedin', userController.loginLinkedin);
    router.post('/retrospective', authGuard, retroController.createNewRetrospective);
    router.post('/retrospective/member', authGuard, retroController.addNewMember);
    router.post('/list', authGuard, retroController.createNewList);
    router.post('/card', authGuard, function (req, res) {
        retroController.createNewCard(req, res, io);
    });
    router.post('/annotation', authGuard, retroController.createNewAnnotation);
    router.post('/card/:id/vote', authGuard, (req, res) => {
        retroController.cardUpvote(req, res, io);
    });

    router.patch('/retrospective/:id', authGuard, retroController.updateRetrospective);
    router.patch('/list/:id', authGuard, retroController.updateList);
    router.patch('/card/:id', authGuard, function (req, res) {
        retroController.updateCard(req, res, io);
    });

    router.delete('/card/:id', authGuard, retroController.deleteCard);
    router.delete('/list/:id', authGuard, retroController.deleteList);
    router.delete('/retrospective/:retroId/member/:userId', authGuard, retroController.removeMember);
    router.delete('/card/:cardId/user/:userId', authGuard, (req, res) => {
        retroController.cardDownvote(req, res, io);
    });

    router.get('/', function (req, res) {
        return res.status(200).send({
            "app": "Agile Retrospective",
            "description": "Agile Retrospective",
            "developer": "Phelipe Rocha",
            "website": "https://pheliperocha.com.br/",
            "email": "phelipeafonso@gmail.com"
        });
    });

    router.get('/*', function (req, res) {
        return res.status(404).send({
            "error": "Not Found",
        });
    });

    io.sockets.on('connection', function (socket) {
        socket.on('subscribe', function (retroId) {
            socket.join(retroId);
        });

        socket.on('enter', data => {
            io.in(data.retroId).emit('enter_member', data.user);
        });

        socket.on('left', data => {
            io.in(data.retroId).emit('left_member', data.user);
        });

        socket.on('delete_card', data => {
            io.in(data.retroId).emit('card_deleted', data.card);
        });
    });

    return router;
};

module.exports = returnRouter;