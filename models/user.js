const database = require('../db');
const jwt = require('jsonwebtoken');
const {secret} = require('../config');
const bcrypt = require('bcrypt');
const authHelper = require('../helpers/authHelper.js');
const { sendResetPsw } = require('../helpers/mailHelper');

module.exports = class User {
    constructor(login, password, full_name, email) {
        this.login = login;
        this.password = password;
        this.full_name = full_name;
        this.email = email;
    }
    logIn(login, res) {
        let temp = this.password;
        database.query('SELECT EXISTS(SELECT login FROM users WHERE login = ?)', login, function(err, result) {
            if(err) {
                return res.status(400).json( {comment: 'Not found'});
            }
            else {
                if(result[0][`EXISTS(SELECT login FROM users WHERE login = '${login}')`] == 0) {
                    return res.status(400).json( {comment: 'User with given login does not exist!'});
                }
                else {
                    database.query('SELECT * FROM users WHERE login=?', login, (err, result) => {
                        if (err) {
                            return res.status(400).json( {comment: 'Not found'});
                        }
                        else {
                            if(bcrypt.compareSync(temp, result[0].password)) {
                                return res.status(200).json( authHelper.updateTokens(+result[0].id, result[0].login, res) );
                            }
                            else {
                                return res.status(400).json( {comment: 'Password is not correct!'});
                            }
                        }
                    });
                }
            }
        });
    }
    logOut(req, res) {
        const token = req.get('Authorization')
        const payload = jwt.verify(token, secret);
        database.query('DELETE FROM tokens WHERE user_id = ?', +payload.userId, function (err, result) {
            if (err) {
                return res.status(400).json( {comment: 'Not found'});
            }
            else {
                res.status(200).json({message: "Logout successfully!"})
                return;
            }
        });
    }
    save(res) {
        let user = {
            login: this.login,
            password: bcrypt.hashSync(this.password, bcrypt.genSaltSync(+process.env.SALT_ROUNDS)),
            full_name: this.full_name,
            email: this.email
        };
        database.query('SELECT EXISTS(SELECT login FROM users WHERE login = ?)', user.login, function(err, result) {
            if(err) {
                return res.status(400).json( {comment: 'Not found'});
            }
            else {
                if(result[0][`EXISTS(SELECT login FROM users WHERE login = '${user.login}')`] == 0) {
                    database.query('SELECT EXISTS(SELECT email FROM users WHERE email = ?)', user.email, function(err, result) {
                        if(err) {
                            return res.status(400).json( {comment: 'Not found'});
                        }
                        else {
                            if(result[0][`EXISTS(SELECT email FROM users WHERE email = '${user.email}')`] == 0) {
                                database.query('INSERT INTO users SET ?', user, function(err, result) {
                                    if (err) {
                                        return res.status(400).json( {comment: 'Not found'});
                                    }
                                    else {
                                        database.query('SELECT * FROM users WHERE login=?', user.login, (err, result) => {
                                            if (err) {
                                                return res.status(400).json( {comment: 'Not found'});
                                            }
                                            else {
                                                let tempRes = authHelper.updateTokens(+result[0].id, result[0].login, res);
                                                return res.status(201).json(tempRes);
                                            }
                                        });
                                    }
                                });
                            }
                            else {
                                return res.status(302).json( {comment: 'A user with this email already exists!'});
                            }
                        }
                    });
                }
                else {
                    return res.status(302).json( {comment: 'A user with this login already exists!'});
                }
            }
        });
    }
    passwordReset(login, res, token) {
        database.query('SELECT EXISTS(SELECT login FROM users WHERE login = ?)', login, function(err, result) {
            if(err) {
                return res.status(400).json( {comment: 'Not found'});
            }
            else {
                if(result[0][`EXISTS(SELECT login FROM users WHERE login = '${login}')`] == 0) {
                    return res.status(400).json( {comment: 'Incorrect login entered!'});
                }
                else {
                    database.query('SELECT * FROM users WHERE login=?', login, (err, result) => {
                        if (err) {
                            return res.status(400).json( {comment: 'Not found'});
                        }
                        else {
                            sendResetPsw(result, token);
                            return res.status(200).json( {comment: 'An email with a link to continue changing your password has been sent to your email!', confPswToken: token});
                        }
                    });
                }
            }
        });
    }
    savePassword(res, newpsw) {
        let user = {
            login: this.login
        };
        database.query('SELECT EXISTS(SELECT login FROM users WHERE login = ?)', user.login, function(err, result) {
            if(err) {
                return res.status(400).json( {comment: 'Not found'});
            }
            else {
                if(result[0][`EXISTS(SELECT login FROM users WHERE login = '${user.login}')`] == 0) {
                    return res.status(400).json( {comment: 'Not found'});
                }
                else {
                    database.query('SELECT * FROM users WHERE login=?', user.login, (err, result) => {
                        if (err) {
                            return res.status(400).json( {comment: 'Not found'});
                        }
                        else {
                            user.password = bcrypt.hashSync(newpsw, bcrypt.genSaltSync(+process.env.SALT_ROUNDS));
                            user.full_name = result[0]['full_name'];
                            user.email = result[0]['email'];
                            database.query('UPDATE users SET ? WHERE login = ?', [user, user.login], function(err, result) {
                                if (err) {
                                    return res.status(400).json( {comment: 'Not found'});
                                }
                                else {
                                    database.query('SELECT * FROM users WHERE login=?', user.login, (err, result) => {
                                        if (err) {
                                            return res.status(400).json( {comment: 'Not found'});
                                        }
                                        else {
                                            authHelper.updateTokens(+result[0].id, result[0].login, res);
                                            return res.status(200).json( {comment: 'Password changed successfully!'});
                                        }
                                    });
                                }
                            });
                        }
                    });
                } 
            }
        });
    }
}
