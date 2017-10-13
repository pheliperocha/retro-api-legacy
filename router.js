var express = require('express');
var router = new express.Router();
var authGuard = require('./middlewares/auth_guard');
var jwt = require('jwt-simple');
var moment = require('moment');
var config = require('./config');

function createJWT(user) {
    var payload = {
        sub: user._id,
        iat: moment().unix(),
        exp: moment().add(14, 'days').unix()
    };
    return jwt.encode(payload, config.TOKEN_SECRET);
}

var userController = require('./controllers/user.controller');
var retroController = require('./controllers/retrospective.controller');
var templateController = require('./controllers/template.controller');

router.get('/facilitador/:userId/retrospective', userController.getAllRetrospectives);
router.get('/retrospective/:id', retroController.getRetrospective);
router.get('/retrospective/:id/list', retroController.getAllLists);
router.get('/retrospective/:id/user', retroController.getAllUsers);
router.get('/template', templateController.getAllTemplates);

router.post('/auth/linkedin', userController.loginLinkedin);
router.post('/retrospective', retroController.createNewRetrospective);
router.post('/list', retroController.createNewList);
router.post('/card', retroController.createNewCard);

router.patch('/retrospective/:id', retroController.updateRetrospective);
router.patch('/list/:id', retroController.updateList);
router.patch('/card/:id', retroController.updateCard);

router.delete('/card/:id', retroController.deleteCard);
router.delete('/list/:id', retroController.deleteList);

router.get('/', function(req, res) {
    return res.status(200).send({
        "app": "Agile Retrospective",
        "description": "Agile Retrospective",
        "developer": "Phelipe Rocha",
        "website": "https://pheliperocha.com.br/",
        "email": "phelipeafonso@gmail.com"
    });
});

router.get('/*', function(req, res) {
    return res.status(404).send({
        "error": "Not Found",
    });
});

module.exports = router;