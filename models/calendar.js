const database = require('../db');
const jwt = require('jsonwebtoken');
const {secret} = require('../config');

module.exports = class Calendar {
    constructor(title, description) {
        this.title = title;
        this.description = description;
    }
    getAllOwnCurrentUserCalendars(res, userId) {
        database.query('SELECT calendars.title, calendars.description FROM calendars WHERE user_id=?', +userId, (err, result) => {
            if(err) {
                return res.status(400).json( {comment: 'Not found'}); 
            }
            else {
                return res.status(200).json(result);
            }
        });
    }
    getAllCurrentUserSubsToCalendars(res, userId) {
        database.query('SELECT calendars.title, calendars.description FROM calendars ' +
            'LEFT OUTER JOIN users_calendars ON calendars.id = users_calendars.calendar_id ' +
            'LEFT OUTER JOIN users ON users_calendars.user_id = users.id ' +
            'WHERE users.id=?', userId, (err, result) => {
                if(err) {
                    return res.status(400).json( {comment: 'Not found'}); 
                }
                else {
                    return res.status(200).json(result);
                }
        });
    }
    createCalendar(res, userId) {
        let calendar = {
            title: this.title,
            description: this.description,
            user_id: +userId
        }
        database.query('INSERT INTO calendars SET ?', calendar, (err, result) => {
            if(err) {
                return res.status(400).json( {comment: 'Not found'}); 
            }
            else {
                return res.status(201).json( {comment: 'Calendar succesfully created!'});
            }
        })
    }
    subscribeUserToCalendar(res, userId, userRole, calendarId, currentUserId) {
        if(+currentUserId !== +userId) {
            database.query('SELECT user_id FROM calendars WHERE id = ?', calendarId, (err, result) => {
                if(err) {
                    return res.status(400).json( {comment: 'Not found'}); 
                }
                else {
                    if(+result[0].user_id === +currentUserId) {
                        database.query('INSERT INTO users_calendars SET ?', {user_id: +userId, calendar_id: +calendarId, role: userRole}, (err, result) => {
                            if (err) { 
                                return res.status(400).json( {comment: 'The user is already subscribed to this calendar!'});
                            }
                            else {
                                return res.status(201).json( {comment: 'User successfully subscribed to the calendar!'});
                            }
                        });
                    }
                    else {
                        return res.status(403).json(); 
                    }
                }
            });
        }
        else {
            return res.status(400).json(); 
        }
    }
    changeSubscribedUserToCalendar(res, userId, userRole, calendarId, currentUserId) {
        database.query('SELECT user_id FROM calendars WHERE id = ?', calendarId, (err, result) => {
            if(err) {
                return res.status(400).json( {comment: 'Not found'}); 
            }
            else {
                if(+result[0].user_id === +currentUserId) {
                    database.query('UPDATE users_calendars SET ? WHERE user_id = ? AND calendar_id = ?', [{role: userRole}, userId, calendarId], (err, result) => {
                        if (err) { 
                            return res.status(400).json( {comment: 'The user is already subscribed to this calendar!'});
                        }
                        else {
                            return res.status(200).json( {comment: 'Subscribed user to the calendar role successfully changed!'});
                        }
                    });
                }
                else {
                    return res.status(403).json(); 
                }
            }
        });
    }
    unsubscribeUserToCalendar(res, userId, calendarId, currentUserId) {
        database.query('SELECT user_id FROM calendars WHERE id = ?', calendarId, (err, result) => {
            if(err) {
                return res.status(400).json( {comment: 'Not found'}); 
            }
            else {
                if(+result[0].user_id === +currentUserId || +userId === +currentUserId) {
                    database.query('DELETE FROM users_calendars WHERE user_id = ? AND calendar_id = ?', [userId, calendarId], (err, result) => {
                        if(err) {
                            return res.status(400).json( {comment: 'Not found'}); 
                        }
                        else {
                            return res.status(204).json( {comment: 'The user has successfully unsubscribed from the calendar!'});
                        }
                    })
                }
                else {
                    return res.status(403).json();
                }
            }
        });
    }
    changeCalendar(res, calendarId, userId) {
        let calendar = {
            title: this.title,
            description: this.description,
        }
        database.query('SELECT user_id FROM calendars WHERE id = ?', calendarId, (err, result) => {
            if(err) {
                return res.status(400).json( {comment: 'Not found'}); 
            }
            else {
                if(+result[0].user_id === +userId) {
                    (calendar.title === undefined) && (delete calendar.title);
                    (calendar.description === undefined) && (delete calendar.description);
                    database.query('UPDATE calendars SET ? WHERE id = ?', [calendar, calendarId], (err, result) => { 
                        if(err) {
                            return res.status(400).json( {comment: 'Not found'}); 
                        }
                        else {
                            return res.status(200).json( {comment: 'Calendar succesfully changed!'});
                        }
                    });
                }
                else {
                    return res.status(403).json(); 
                }
            }
        })
    }
    deleteCalendar(res, calendarId, userId) {
        database.query('SELECT user_id FROM calendars WHERE id = ?', calendarId, (err, result) => {
            if(err) {
                return res.status(400).json( {comment: 'Not found'}); 
            }
            else {
                if(+result[0].user_id === +userId) {
                    database.query('DELETE FROM calendars WHERE id=?', calendarId, (err, result) => {
                        if(err) {
                            return res.status(400).json( {comment: 'Not found'}); 
                        }
                        else {
                            return res.status(204).json( {comment: 'Calendar succesfully deleted!'});
                        }
                    })
                }
                else {
                    return res.status(403).json(); 
                }
            }
        })
    }
}