const database = require('../db');
const jwt = require('jsonwebtoken');
const {secret} = require('../config');
const bcrypt = require('bcrypt');
const authHelper = require('../helpers/authHelper.js');
const { sendResetPsw } = require('../helpers/mailHelper');
const imgbbUploader = require('imgbb-uploader');

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
            email: this.email,
            picture: 'https://i.ibb.co/jyqT1by/3-E482896-06-CC-4-D2-A-91-DC-C19-CDBFCBC2-B-w1200-r1.webp'
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
    getInfoCurrentUser(res, login) {
        database.query('SELECT * FROM users WHERE login = ?', login, (err, result) => {
            if(err) {
                return res.status(400).json( {comment: 'Not found'});
            }
            else {
                return res.status(200).json(result);
            }
        });
    }
    updateCurrentAvatarMe(res, userID, avatar){
        let imageFile = avatar;
        imageFile.mv('file.jpg', (err)=>{
            if(err){
                res.status(400).json({message:'error'});
            }
            imgbbUploader('cbfb2ed4fcb5a79cfbf40e535e8b532d', 'file.jpg')
            .then((response =>{
                mysql.query(`UPDATE users SET picture='${response.url}' WHERE id=${userID}`, (err, resultUpdating)=>{
                    if(err) {
                        res.status(404).json({message: err});
                    }
                    else if(resultUpdating.affectedRows === 0) {
                        res.status(404).json({message :"No such user with this ID"});
                    }
                    else {
                        res.status(200).json({message: "Picture successfully added!"});
                    }
                })
            }))
            .catch((error)=>{res.status(400).json({message:"error"})})
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
}
