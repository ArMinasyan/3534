let route = require('express').Router();
let defender = require('../config/defender');
let path = require('path');

route.get('/:name', defender, function (req, res) {
    if (req.params.name == 'data') res.sendFile(path.join(__dirname, '../views', 'DataReplicated.html'));
    else res.sendFile(path.join(__dirname, '../views', req.params.name));
})

route.get('/', function (req, res) {
    if (req.cookies.token) res.sendFile(path.join(__dirname, '../', 'views', 'DataReplicated.html'));
    res.sendFile(path.join(__dirname, '../views', 'Account.html'));
})



route.get('/data', defender, function (req, res) {
    res.sendFile(path.join(__dirname, '../', 'views', 'DataReplicated.html'));
})


module.exports = route;