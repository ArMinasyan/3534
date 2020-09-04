let jwt = require('jsonwebtoken');
let fs = require('fs');

let defender = (req, res, next) => {
    let token = req.cookies.token;
    if (token) {
        jwt.verify(token, fs.readFileSync('./keys/Public.key'), function (err, decode) {
            if (err || !decode) return false;
            else {
                res.locals.id = decode.id;
                return next()
            }
        })
    } else return false
}

module.exports = defender;