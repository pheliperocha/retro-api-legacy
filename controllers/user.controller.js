var User = require('../models/user');

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
            var token = createJWT(profile);
            res.send({
                token: token,
                user: {
                    id: 1656,
                    name: 'Phelipe Rocha',
                    email: 'phelipeafonso@gmail.com',
                    image: 'https://s3-sa-east-1.amazonaws.com/pheliperocha/images/brand/PhelipeRocha-150.jpg',
                    status: 1
                }
            });
        });
    });
};

exports.getAllRetrospectives = function(req, res) {

    var retrospectives = [{
        id: 1,
        title: "Retrospectiva número 1",
        date: '02/09/2017',
        image: ''
    }, {
        id: 2,
        title: "Retrospectiva número 2",
        date: '16/09/2017',
        image: ''
    }, {
        id: 3,
        title: "Retrospectiva número 3",
        date: '30/09/2017',
        image: ''
    }];

    return res.status(200).send(retrospectives);
};