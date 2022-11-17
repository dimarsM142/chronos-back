const { v4: uuidv4 } = require('uuid');

const jwt = require('jsonwebtoken');
const {secret, tokens} = require('../config');
const database = require('../db');

const generateAccessToken = (userId, userLogin) => {
    const payload = {
        userId,
        userLogin,
        type: tokens.access.type
    };

    const options = { expiresIn: tokens.access.expiresIn};

    return jwt.sign(payload, secret, options);
}

const generateRefreshToken = () => {
    const payload = {
        id: uuidv4(),
        type: tokens.refresh.type
    };

    const options = { expiresIn: tokens.refresh.expiresIn};

    return {
        id: payload.id,
        token: jwt.sign(payload, secret, options)
    };
    
}

const replaceDbRefreshToken = (tokenId, userId, res) => {
    let token = {
        id: tokenId,
        user_id: userId
    }
    database.query('DELETE FROM tokens WHERE user_id = ?', userId, function (err, result) {
        if (err) {
            return res.status(400).json( {comment: 'Not found'});
        }
        else {
            database.query('INSERT INTO tokens SET ?', token, function(err, result) {
                if (err) {
                    return res.status(400).json( {comment: 'Not found'});
                }
                else {
                    return res.status(200).json();
                }
            });
        }
    });
}

const updateTokens = (userId, userLogin, res) => {
    const accessToken = generateAccessToken(+userId, userLogin);
    const refreshToken = generateRefreshToken();
    replaceDbRefreshToken(refreshToken.id, +userId, res);
    return {accessToken: accessToken, refreshToken: refreshToken.token};
};

module.exports = {
    generateAccessToken,
    generateRefreshToken,
    replaceDbRefreshToken,
    updateTokens
}
