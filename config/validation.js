let { body } = require('express-validator');

let reg_validation = [
    body('email').trim().not().isEmpty().withMessage('Email field is required').isEmail().withMessage('Enter valid email address'),
    body('password').trim().not().isEmpty().withMessage('Password field is required'),
    body('confirm_password').trim().not().isEmpty().withMessage('Confirm password field is required').custom((val, { req }) => {
        if (val != req.body.password) throw new Error('Password confirmation does not match password');
        else return true
    })
]

let log_validation = [
    body('email').trim().not().isEmpty().withMessage('Email field is required').isEmail().withMessage('Enter valid email address'),
    body('password').trim().not().isEmpty().withMessage('Password field is required'),

]

module.exports = { reg_validation, log_validation };