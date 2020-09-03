let route = require('express').Router();
let { validationResult } = require('express-validator');
let valid = require('../config/validation');
let bcrypt = require('bcrypt');
let user = require('../models/user');
let jwt = require('jsonwebtoken');
let fs = require('fs');

route.post('/registration', valid.reg_validation, function (req, res) {
    let vr = validationResult(req);
    if (!vr.isEmpty()) res.send(vr.errors[0]);
    else {
        user.findOne({ email: req.body.email }, function (err, result) {
            if (result) res.json({ "msg": "Username already exist" }); else {
                let User = new user({
                    email: req.body.email,
                    password: bcrypt.hashSync(req.body.password, 10),
                });
                User.save(function (err, doc) {
                    if (!err && doc) {
                        let token = jwt.sign({ id: doc._id, time: Date.now() }, fs.readFileSync('./keys/Private.key'), { algorithm: "RS512" });
                        res.cookie("token", token, {
                            sameSite: true,
                            httpOnly: true
                        });
                        res.json({ "login": true });
                    }
                })
            }

        })
    }
})

module.exports = route;