const jwt = require('jsonwebtoken');
const {secret} = require('../config');
const authHelper = require('../helpers/authHelper.js');

module.exports = (req, res, next) => {

    const token = req.get('Authorization')
    res.clearCookie('login', {httpOnly: true});
    if(!token) {
        res.status(401).json( {comment: 'Token not provided!'});
        return;
    }

    try {
        const payload = jwt.verify(token, secret);
        if(payload.type !== 'access') {
            res.status(400).json( {comment: 'Incorrect token!'});
            return;
        }
    }
    catch(err) {
        if(err instanceof jwt.TokenExpiredError) {
            res.status(400).json( {comment: 'Token expired!'});
            return;
        }
        if(err instanceof jwt.JsonWebTokenError) {
            res.status(400).json( {comment: 'Incorrect token!'});
            return 
        }
    }
    next();
}
