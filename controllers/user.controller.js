var User = require('../models/user');
var config = require('../config');
var request = require('request');
var moment = require('moment');
var jwt = require('jwt-simple');

function createJWT(user) {
    var payload = {
        sub: user._id,
        iat: moment().unix(),
        exp: moment().add(14, 'days').unix()
    };
    return jwt.encode(payload, config.TOKEN_SECRET);
}

exports.loginLinkedin = function (req, res) {
    var accessTokenUrl = 'https://www.linkedin.com/uas/oauth2/accessToken';
    var peopleApiUrl = 'https://api.linkedin.com/v1/people/~:(id,first-name,last-name,email-address,picture-url)';
    var params = {
        code: req.body.code,
        client_id: req.body.clientId,
        client_secret: config.LINKEDIN_SECRET,
        redirect_uri: req.body.redirectUri,
        grant_type: 'authorization_code'
    };

    request.post(accessTokenUrl, { form: params, json: true }, function(err, response, body) {

        if (response.statusCode !== 200) {
            return res.status(response.statusCode).send({ message: body.error_description });
        }

        var params = {
            oauth2_access_token: body.access_token,
            format: 'json'
        };

        request.get({ url: peopleApiUrl, qs: params, json: true }, function(err, response, profile) {

            User.getByEmail(profile.emailAddress, existingUser => {

                if (existingUser) {
                    var token = createJWT(existingUser);
                    res.send({ token: token, user: existingUser });
                } else {
                    User.insert(profile.firstName + ' ' + profile.lastName, profile.emailAddress, profile.pictureUrl, profile.id, newUser => {
                        var token = createJWT(newUser);
                        res.send({ token: token, user: newUser });
                    });
                }
            });
        });
    });
};

exports.getAllRetrospectives = function(req, res) {
    User.myRetrospectives(req.params.userId, result => {
        return res.status(200).send(result);
    });
};