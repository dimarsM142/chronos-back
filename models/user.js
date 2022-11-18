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
    getInfoCurrentUser(res, userId) {
        database.query('SELECT * FROM users WHERE id = ?', +userId, (err, result) => {
            if(err) {
                return res.status(400).json( {comment: 'Not found'});
            }
            else {
                return res.status(200).json(result);
            }
        });
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
    deleteAccountCurrentUser(res, userId) {
        database.query('DELETE FROM users WHERE id = ?', +userId, (err, result) => {
            if(err) {
                return res.status(400).json( {comment: 'Not found'});
            }
            else {
                database.query('DELETE FROM tokens WHERE user_id = ?', +userId, (err, result) => {
                    if (err) {
                        return res.status(400).json( {comment: 'Not found'});
                    }
                    else {
                        return res.status(200).json({message: "Your account successfully deleted!"});
                    }
                });
            }
        })
    }
    logOut(req, res) {
        const token = req.get('Authorization')
        const payload = jwt.verify(token, secret);
        database.query('DELETE FROM tokens WHERE user_id = ?', +payload.userId, (err, result) => {
            if (err) {
                return res.status(400).json( {comment: 'Not found'});
            }
            else {
                return res.status(200).json({message: "Logout successfully!"});
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
    uploadCurrentUserAvatar(res, userId) {
        const user = {
            picture: `http://192.168.20.251:3001/img/user${userId}.jpg`
        }
        database.query('UPDATE users SET ? WHERE id = ?', [user, +userId], function(err, result) {
            if (err) {
                return res.status(400).json( {comment: 'Not found'});
            }
            else {
                req.files.photo.mv(`img/user${userId}.jpg`);
                return res.status(200).json( {path: `http://192.168.20.251:3001/img/user${userId}.jpg`} );
            }
        });
    }
    resave(res, userId) {
        let user = {
            login: this.login,
            password: (this.password !== undefined)?(bcrypt.hashSync(this.password, bcrypt.genSaltSync(+process.env.SALT_ROUNDS))):(undefined),
            full_name: this.full_name,
            email: this.email
        };

        (user.login === undefined) && (delete user.login);
        (user.password === undefined) && (delete user.password);
        (user.full_name === undefined) && (delete user.full_name);
        (user.email === undefined) && (delete user.email);

        database.query('UPDATE users SET ? WHERE id = ?', [user, userId], function(err, result) {
            if (err) {
                let key;
                if(err.sqlMessage.includes('login')) {
                    key = 'login';
                }
                else if(err.sqlMessage.includes('full_name')) {
                    key = 'full_name';
                }
                else if(err.sqlMessage.includes('email')) {
                    key = 'email';
                }
                return res.status(400).json( {comment: 'Bad request', code: err.code, key: key});
            }
            else {
                database.query('SELECT * FROM users WHERE id=?', userId, (err, result) => {
                    if (err) {
                        return res.status(400).json( {comment: 'Not found'});
                    }
                    else {
                        return res.status(201).json(result);
                    }
                });
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
