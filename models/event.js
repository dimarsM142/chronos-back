const database = require('../db');
const jwt = require('jsonwebtoken');
const {secret} = require('../config');

module.exports = class Event {
    constructor(title, description, execution_date, type, duration) {
        this.title = title;
        this.description = description;
        this.execution_date = execution_date;
        this.type = type;
        this.duration = duration;
    }
    getAllEventsFromCurrentCalendar(res, calendarId, userId, month) {
        database.query('SELECT user_id FROM calendars WHERE id = ?', calendarId, (err, result) => {
            if(err) {
                return res.status(400).json( {comment: 'Not found'}); 
            }
            else {
                if(+result[0].user_id === +userId) {
                    database.query('SELECT title, description, execution_date FROM events WHERE calendar_id = ?'  + ((month !== -1)?(` AND execution_date LIKE '%${month}%'`):('')), calendarId, (err, result) => {
                        if(err) {
                            return res.status(400).json( {comment: 'Not found'}); 
                        }
                        else {
                            return res.status(200).json(result);
                        }
                    })
                }
                else {
                    database.query('SELECT * FROM users_calendars WHERE user_id = ? AND calendar_id = ?', [userId, calendarId], (err, result) => {
                        if(err) {
                            return res.status(400).json( {comment: 'Not found'}); 
                        }
                        else {
                            if(result.length === 0) {
                                return res.status(403).json(); 
                            }
                            else {
                                database.query('SELECT title, description, execution_date FROM events WHERE calendar_id = ?' + ((month !== -1)?(` AND execution_date LIKE '%${month}%'`):('')), calendarId, (err, result) => {
                                    if(err) {
                                        return res.status(400).json( {comment: 'Not found'}); 
                                    }
                                    else {
                                        return res.status(200).json(result);
                                    }
                                })
                            }
                        }
                    })
                    
                }
            }
        });
    }
    createEvent(res, calendarId, userId) {
        let event = {
            title: this.title,
            description: this.description,
            calendar_id: +calendarId,
            execution_date: this.execution_date,
            type: this.type,
            duration: this.duration
        }
        database.query('SELECT user_id FROM calendars WHERE id = ?', calendarId, (err, result) => {
            if(err) {
                return res.status(400).json( {comment: 'Not found'}); 
            }
            else {
                if(+result[0].user_id === +userId) {
                    if(event.type !== "arrangement") {
                        event.duration = 0;
                    }
                    database.query('INSERT INTO events SET ?', event, (err, result) => {
                        if(err) {
                            return res.status(400).json( {comment: 'Not found'}); 
                        }
                        else {
                            return res.status(201).json( {comment: 'Event succesfully created!'});
                        }
                    })
                }
                else {
                    console.log(userId, calendarId);
                    database.query('SELECT role FROM users_calendars WHERE user_id = ? AND calendar_id = ?', [userId, calendarId], (err, result) => {
                        if(err) {
                            return res.status(400).json( {comment: 'Not found'}); 
                        }
                        else {
                            console.log(result);
                            if(result.length === 0 || result[0].role === 'user') {
                                return res.status(403).json(); 
                            }
                            else {
                                if(event.type !== "arrangement") {
                                    event.duration = 0;
                                }
                                database.query('INSERT INTO events SET ?', event, (err, result) => {
                                    if(err) {
                                        return res.status(400).json( {comment: 'Not found'}); 
                                    }
                                    else {
                                        return res.status(201).json( {comment: 'Event succesfully created!'});
                                    }
                                })
                            }
                        }
                    })
                    
                }
            }
        });
    }
    changeEvent(res, calendarId, eventId, userId) {
        let event = {
            title: this.title,
            description: this.description,
            execution_date: this.execution_date,
            type: this.type,
            duration: this.duration
        }
        database.query('SELECT user_id FROM calendars WHERE id = ?', calendarId, (err, result) => {
            if(err) {
                return res.status(400).json( {comment: 'Not found'}); 
            }
            else {
                if(+result[0].user_id === +userId) {
                    (event.title === undefined) && (delete event.title);
                    (event.description === undefined) && (delete event.description);
                    (event.execution_date === undefined) && (delete event.execution_date);
                    (event.type === undefined) && (delete event.type);
                    (event.duration === undefined) && (delete event.duration);
                    if(event.duration !== undefined && event.type !== "arrangement") {
                        event.duration = 0;
                    }
                    database.query('UPDATE events SET ? WHERE id = ?', [event, eventId], (err, result) => { 
                        if(err) {
                            return res.status(400).json( {comment: 'Not found'}); 
                        }
                        else {
                            return res.status(200).json( {comment: 'Event succesfully changed!'});
                        }
                    });
                }
                else {
                    database.query('SELECT role FROM users_calendars WHERE user_id = ? AND calendar_id = ?', [userId, calendarId], (err, result) => {
                        if(err) {
                            return res.status(400).json( {comment: 'Not found'}); 
                        }
                        else {
                            if(result.length === 0  || result[0].role === 'user') {
                                return res.status(403).json(); 
                            }
                            else {
                                (event.title === undefined) && (delete event.title);
                                (event.description === undefined) && (delete event.description);
                                (event.execution_date === undefined) && (delete event.execution_date);
                                (event.type === undefined) && (delete event.type);
                                (event.duration === undefined) && (delete event.duration);
                                if(event.type !== "arrangement") {
                                    event.duration = 0;
                                }
                                database.query('UPDATE events SET ? WHERE id = ?', [event, eventId], (err, result) => { 
                                    if(err) {
                                        return res.status(400).json( {comment: 'Not found'}); 
                                    }
                                    else {
                                        return res.status(200).json( {comment: 'Event succesfully changed!'});
                                    }
                                });
                            }
                        }
                    })
                }
            }
        });
    }
    deleteEvent(res, calendarId, eventId, userId) {
        database.query('SELECT user_id FROM calendars WHERE id = ?', calendarId, (err, result) => {
            if(err) {
                return res.status(400).json( {comment: 'Not found'}); 
            }
            else {
                if(+result[0].user_id === +userId) {
                    database.query('DELETE FROM events WHERE id=?', eventId, (err, result) => {
                        if(err) {
                            return res.status(400).json( {comment: 'Not found'}); 
                        }
                        else {
                            return res.status(204).json();
                        }
                    })
                }
                else {
                    database.query('SELECT role FROM users_calendars WHERE user_id = ? AND calendar_id = ?', [userId, calendarId], (err, result) => {
                        if(err) {
                            return res.status(400).json( {comment: 'Not found'}); 
                        }
                        else {
                            if(result.length === 0  || result[0].role === 'user') {
                                return res.status(403).json(); 
                            }
                            else {
                                database.query('DELETE FROM events WHERE id=?', eventId, (err, result) => {
                                    if(err) {
                                        return res.status(400).json( {comment: 'Not found'}); 
                                    }
                                    else {
                                        return res.status(204).json();
                                    }
                                })
                            }
                        }
                    })
                }
            }
        });
    }
}