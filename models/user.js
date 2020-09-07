let { model } = require('mongoose');

module.exports = model('user', {
    email: String,
    password: String,
    type: String,
    token: String
})