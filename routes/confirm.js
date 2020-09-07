let route = require('express').Router();
let user = require('../models/user');
let jwt = require('jsonwebtoken');
let fs = require('fs');

route.get('/confirm/:email/:token', function (req, res) {
    user.findOneAndUpdate({ $and: [{ email: req.params.email }, { token: req.params.token }] }, { token: '-' }, function (err, doc) {

        if (doc) {
            let token = jwt.sign({ id: doc._id, time: Date.now() }, fs.readFileSync('./keys/Private.key'), { algorithm: "RS512" });
            res.cookie("token", token, {
                sameSite: true,
                httpOnly: true,
                maxAge: 10 * 36000
            });

            //res.setHeader("Location", '/data');
            //   res.redirect('/data');
            //req.url = '/data';
            res.sendFile(path.join(__dirname, '../', 'views', 'DataReplicated.html'));
        }
        else res.redirect('/');
    })
})

module.exports = route;