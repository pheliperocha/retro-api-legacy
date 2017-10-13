exports.getAllTemplates = function (req, res) {
    var templates = [
        {
            id: 1,
            name: 'Template 1',
            image: 'http://placehold.it/200x200'
        },{
            id: 2,
            name: 'Template 2',
            image: 'http://placehold.it/200x200'
        },{
            id: 3,
            name: 'Template 3',
            image: 'http://placehold.it/200x200'
        },{
            id: 4,
            name: 'Template 4',
            image: 'http://placehold.it/200x200'
        },{
            id: 6,
            name: 'Template 6',
            image: 'http://placehold.it/200x200'
        }
    ];

    return res.status(200).send(templates);
};