let route = require('express').Router();
let { validationResult } = require('express-validator');
let valid = require('../config/validation');
let bcrypt = require('bcrypt');

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
                    if (!err && doc) res.json({ "msg": "Account successfuly created" });
                })
            }

        })
    }
})

module.exports = route;