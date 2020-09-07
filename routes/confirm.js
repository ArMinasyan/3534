let route = require('express').Router();
let user = require('../models/user');
let jwt = require('jsonwebtoken');
let fs = require('fs');
let path = require('path');
route.get('/confirm', function (req, res) {
    user.findOneAndUpdate({ $and: [{ email: req.query.email }, { token: req.query.token }] }, { token: '-' }, function (err, doc) {

        if (doc) {
            let token = jwt.sign({ id: doc._id, time: Date.now() }, fs.readFileSync('./keys/Private.key'), { algorithm: "RS512" });
            res.cookie("token", token, {
                sameSite: true,
                httpOnly: true,
                maxAge: 10 * 36000
            });

            //res.sendFile(path.join(__dirname, '../', 'views', 'DataReplicated.html'));
            res.redirect('/');
        }
        else res.redirect('/');
    })
})

module.exports = route;