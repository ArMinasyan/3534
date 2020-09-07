let route = require('express').Router();
let { validationResult } = require('express-validator');
let valid = require('../config/validation');
let bcrypt = require('bcrypt');
let user = require('../models/user');
let jwt = require('jsonwebtoken');
let fs = require('fs');
let send = require('../config/SendEmail');
let randomString = require('randomstring');
route.post('/registration', valid.reg_validation, function (req, res) {
    let vr = validationResult(req);
    if (!vr.isEmpty()) res.send(vr.errors[0]);
    else {
        user.findOne({ email: req.body.email }, function (err, result) {
            if (result) res.json({ "msg": "Username already exist" }); else {
                let token = randomString.generate();
                let User = new user({
                    email: req.body.email,
                    password: bcrypt.hashSync(req.body.password, 10),
                    token: token
                });
                User.save(async function (err, doc) {
                    if (!err && doc) {
                        // let token = jwt.sign({ id: doc._id, time: Date.now() }, fs.readFileSync('./keys/Private.key'), { algorithm: "RS512" });
                        // res.cookie("token", token, {
                        //     sameSite: true,
                        //     httpOnly: true
                        // });
                        //  new_user.save(async (err, save) => {
                        if (err) res.status(501).end('Try again'); else {
                            result = await send(req.body.email, token);
                        }
                        if (!err && result === true) res.status(200).json({ msg: 'Please, check your email, for complete your registration' }).end();
                        else res.send('Try again').end();
                    }
                    //  res.json({ "login": true });
                })
            }

        })
    }
})

module.exports = route;