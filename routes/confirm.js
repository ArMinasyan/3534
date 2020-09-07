let route = require('express').Router();
let user = require('../models/user');
let jwt = require('jsonwebtoken');
let fs = require('fs');
let path = require('path');
route.post('/confirm', function (req, res) {
    user.findOneAndUpdate({ $and: [{ email: req.body.email }, { token: req.body.token }] }, { token: '-' }, function (err, doc) {

        if (doc) {
            bcrypt.compare(req.body.password, doc.password, function (err, same) {
                if (same) {
                    let token = jwt.sign({ id: doc._id, time: Date.now() }, fs.readFileSync('./keys/Private.key'), { algorithm: "RS512" });
                    res.cookie("token", token, {
                        sameSite: true,
                        httpOnly: true,
                        maxAge: 10 * 36000
                    });

                    res.json({ 'login': true })
                } else res.json({ 'msg': "Incorrect username and/or password" });

            })
        } else res.json({ 'msg': "Invalid token" });
    })
})

module.exports = route;