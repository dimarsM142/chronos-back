const jwt = require('jsonwebtoken');
const {secret} = require('../config');
const database = require('../db');
const User = require('../models/user');
const { userValidation, changeValidation } = require('../validators/validator');

const getInfoCurrentUser = (req, res) => {
    const token = req.get('Authorization')
    const payload = jwt.verify(token, secret);
    let user = new User();
    user.getInfoCurrentUser(res, payload.userId);
}

const  patchUsersAvatarMe = (req, res) => {
    const token = req.get('Authorization')
    const payload = jwt.verify(token, secret);
    let user = new User();
    user.updateCurrentAvatarMe(res, payload.userId, req.files.file);
        //let users = new Users();
        //users.updateCurrentAvatarMe(res, decodedToken.result.userID, req.files.file);
}

const changeInfoCurrentUser = (req, res) => {
    if(req.body.email !== undefined && !req.body.email.endsWith("@gmail.com")) {
        return res.status(400).json( {comment: "Incorrect email entered (use gmail)!"});
    }
    const {error} = changeValidation(req.body);
    if(error) {
        return res.status(400).json( {comment: error.details[0].message});
    }
    const token = req.get('Authorization');
    const payload = jwt.verify(token, secret);
    let user = new User(req.body.login, req.body.psw, req.body.fname, req.body.email);
    user.resave(res, payload.userId);
}

const deleteAccountCurrentUser = (req, res) => {
    const token = req.get('Authorization');
    const payload = jwt.verify(token, secret);
    let user = new User();
    user.deleteAccountCurrentUser(res, payload.userId);
}

const getUsersAvatarMe = (req, res) => {
    const token = req.get('Authorization');
    const payload = jwt.verify(token, secret);
    let user = new User();
    user.getAvatarMe(res, payload.userId);
}

module.exports = {
    getInfoCurrentUser,
    changeInfoCurrentUser,
    deleteAccountCurrentUser,
    patchUsersAvatarMe,
    getUsersAvatarMe
}
