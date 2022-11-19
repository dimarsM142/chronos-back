const database = require('../db');
const jwt = require('jsonwebtoken');
const {secret} = require('../config');
//const { sendCreateEventNotification } = require('../helpers/mailHelper');

const filteringEvents = (req) => {
    let stringForFiltering = '';

    //фільтр month; використовувати наступним чином: month="2011-09" etc.
    let month = (req.query.month !== undefined && (req.query.month).length === 7 && !!Number(+(req.query.month).slice(0, 4)) && (!!Number(+(req.query.month).slice(5, 7)) 
        && (+(req.query.month).slice(5, 7) >= 1 && +(req.query.month).slice(5, 7) <= 12)) && (req.query.month)[4] === '-') ? (req.query.month) : (-1);

    //фільтр type; використовувати наступним чином: type="task" etc.
    let type = ((req.query.type === 'arrangement' || req.query.type === 'task' || req.query.type === 'reminder'))?(req.query.type):(-1);

    //фільтр limit; використовувати наступним чином: limit="123" etc.
    let limit = (!!Number(req.query.limit) && (+req.query.limit > 0)) ? (+req.query.limit) : (-1);

    //фільтр page; використовувати наступним чином: page="1" etc. 
    let page = (!!Number(req.query.page) && (+req.query.page > 0)) ? (+req.query.page) : (-1);

    //фільтр search; використовувати наступним чином: search="something" etc.
    let search = (req.query.search !== undefined)?(req.query.search):(-1);

    stringForFiltering += (month !== -1)?(` AND execution_date LIKE '${month}%'`):('');
    stringForFiltering += (type !== -1)?(` AND type = '${type}'`):('');
    stringForFiltering += (search !== -1)?(` AND (title LIKE "%${search}%" OR description LIKE "%${search}%")`):('');

    if(limit !== -1) {
        if(page !== -1) {
            stringForFiltering += ` LIMIT ${limit*(page - 1)}, ${limit}`
        }
        else {
            stringForFiltering += ` LIMIT ${limit}`
        }
    }

    return stringForFiltering;
}

module.exports = class Event {
    constructor(title, description, execution_date, type, duration) {
        this.title = title;
        this.description = description;
        this.execution_date = execution_date;
        this.type = type;
        this.duration = duration;
    }
    getAllEventsFromCurrentCalendar(req, res, calendarId, userId) {
        database.query('SELECT user_id FROM calendars WHERE id = ?', calendarId, (err, result) => {
            if(err) {
                return res.status(400).json( {comment: 'Not found'}); 
            }
            else {
                if(+result[0].user_id === +userId) {
                    database.query('SELECT id, title, description, execution_date, type, duration FROM events WHERE calendar_id = ?' + filteringEvents(req), calendarId, (err, result) => {
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
                                database.query('SELECT id, title, description, execution_date, type, duration FROM events WHERE calendar_id = ?' + filteringEvents(req), calendarId, (err, result) => {
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
                    database.query('SELECT role FROM users_calendars WHERE user_id = ? AND calendar_id = ?', [userId, calendarId], (err, result) => {
                        if(err) {
                            return res.status(400).json( {comment: 'Not found'}); 
                        }
                        else {
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