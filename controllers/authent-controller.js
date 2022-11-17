const jwt = require('jsonwebtoken');
const User = require('../models/user');
const {secret} = require('../config');
const database = require('../db');
const { userValidation,
        loginValidation,
        pswResValidation,
        confPswResValidation } = require('../validators/validator');

const generateAccesToken = () => {
    let tempCode = generateString();
    const payload = {
        tempCode
    };
    return jwt.sign(payload, secret, {expiresIn: "5m"});
}

let range = (start, end) => [...Array(end - start).keys(), end - start].map(n => start + n);
let A = range(65, 90);
let a = range(97, 122);
let dig = range(48, 57);
let all = A.concat(a).concat(dig);

function generateString(length = 6) {
    let str = '';
    for(let i = 0; i < length; i++){
        str += String.fromCharCode(all[Math.floor(Math.random() * all.length)]);
    }
    return str;
}

const register = (req, res) => {
    const {error} = userValidation(req.body);
    if(error) {
        return res.status(400).json( {comment: error.details[0].message});
    }
    if(!req.body.email || !req.body.email.endsWith("@gmail.com")) {
        return res.status(400).json( {comment: "Incorrect \"email\" entered (use gmail)!"});
    }
    let user = new User(req.body.login, req.body.psw, req.body.fname, req.body.email);
    if(req.body.psw === req.body.repeatpsw) {
        user.save(res);
    }
    else {
        return res.status(400).json( {comment: 'The entered passwords do not match!'});
    }
}

const login = (req, res) => {
    const {error} = loginValidation(req.body);
    if(error) {
        return res.status(400).json( {comment: error.details[0].message});
    }
    let user = new User(req.body.login, req.body.psw);
    user.logIn(req.body.login, res);
}

const logout = (req, res) => {
    let user = new User();
    user.logOut(req, res);
}

const pswReset = (req, res) => {
    const {error} = pswResValidation(req.body);
    if(error) {
        return res.status(400).json( {comment: error.details[0].message});
    }
    let tempToken = generateAccesToken();
    let user = new User(req.body.login);
    user.passwordReset(req.body.login, res, tempToken);
}

const confPswReset = (req, res) => {
    const {error} = confPswResValidation(req.body);
    if(error) {
        return res.status(400).json( {comment: error.details[0].message});
    }
    const { confirmToken } = req.params;
    const newpsw = req.body.newpsw;
    const repeatnewpsw = req.body.repeatnewpsw;


    try {
        jwt.verify(confirmToken, secret);
        if(newpsw === repeatnewpsw) {
            let user = new User(req.body.login);
            user.savePassword(res, newpsw);
        }
        else {
            return res.status(400).json( {comment: 'The entered passwords do not match!'} );
        }
    }
    catch(err) {
        if(err instanceof jwt.TokenExpiredError) {
            res.status(400).json( {comment: 'Token expired!'});
            return;
        }
        if(err instanceof jwt.JsonWebTokenError) {
            return res.status(400).json( {comment: 'Incorrect token!'});
        }
    }
}

const refreshTokens = (req, res) => {
    const refreshToken = req.body.refreshToken;
    let payload;
    try {
        payload = jwt.verify(refreshToken, secret);
        if (payload.type !== 'refresh') {
            res.status(400).json( {comment: 'Invalid token!'});
            return;
        }
    }
    catch(err) {
        if(err instanceof jwt.TokenExpiredError) {
            res.status(400).json({comment: 'Token expired!!'})
            return;
        }
        else if(err instanceof jwt.JsonWebTokenError) {
            res.status(400).json( {comment: 'Invalid token!'});
            return;
        }
    }
    database.query('SELECT EXISTS(SELECT token_id FROM tokens WHERE token_id = ?)', payload.id, function(err, result) {
        if(err) {
            return res.status(400).json( {comment: 'Not found'});
        }
        else {
            if(result[0][`EXISTS(SELECT token_id FROM tokens WHERE token_id = '${payload.id}')`] == 0) {
                res.status(400).json( {comment: 'Invalid token!'});
            }
            else {
                database.query('SELECT tokens.user_id, users.login FROM tokens ' +
                'LEFT OUTER JOIN users ON tokens.user_id = users.user_id ' +
                'WHERE tokens.token_id=?', payload.id, (err, result) => {
                    if (err) {
                        return res.status(400).json( {comment: 'Not found'});
                    }
                    else {
                        return res.status(201).json( authHelper.updateTokens(result[0].user_id, result[0].login, res) );
                    }
                });
            }
        }
    });
}

module.exports = {
    register,
    login,
    logout,
    pswReset,
    confPswReset,
    refreshTokens
}
