let route = require('express').Router();

route.delete('/logout', function (req, res) {
    res.clearCookie('token');
    res.json({ "login": false });
})

module.exports = route;