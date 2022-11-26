const database = require('../db');
const { createRemindFunction,
        changeRemindFunction,
        deleteRemindFunction } = require('../helpers/checkRemindesHelper');
const { createEventNtfc,
        changeEventNtfc,
        deleteEventNtfc } = require('../helpers/mailHelper');

const filteringEvents = (req) => {
    let stringForFiltering = '';

    //фільтр week; використовувати наступним чином: week=2011-09-22
    let week = (req.query.week !== undefined && (req.query.week).length === 10 && !!Number(+(req.query.week).slice(0, 4)) && (!!Number(+(req.query.week).slice(5, 7))
        && (+(req.query.week).slice(5, 7) >= 1 && +(req.query.week).slice(5, 7) <= 12)) && (req.query.week)[4] === '-' && (req.query.week)[7] === '-' && 
        (!!Number(+(req.query.week).slice(8, 10)) && (+(req.query.week).slice(8, 10) >= 1 && (+(req.query.week).slice(8, 10) <= 31)))) ? (req.query.week) : (-1);

    //фільтр month; використовувати наступним чином: month=2011-09 etc.
    let month = (req.query.month !== undefined && (req.query.month).length === 7 && !!Number(+(req.query.month).slice(0, 4)) && (!!Number(+(req.query.month).slice(5, 7)) 
        && (+(req.query.month).slice(5, 7) >= 1 && +(req.query.month).slice(5, 7) <= 12)) && (req.query.month)[4] === '-') ? (req.query.month) : (-1);
    
    let year = (req.query.year !== undefined && (req.query.year).length === 4 && (!!Number(+(req.query.month).slice(0, 4)) && +(req.query.month).slice(0, 4) > 1970 && 
        +(req.query.month).slice(0, 4) < 2100)) ? (+req.query.year) : (-1);

    //фільтр type; використовувати наступним чином: type=task etc.
    let type = ((req.query.type === 'arrangement' || req.query.type === 'task' || req.query.type === 'reminder'))?(req.query.type):(-1);

    //фільтр limit; використовувати наступним чином: limit=123 etc.
    let limit = (!!Number(req.query.limit) && (+req.query.limit > 0)) ? (+req.query.limit) : (-1);

    //фільтр page; використовувати наступним чином: page=1 etc. 
    let page = (!!Number(req.query.page) && (+req.query.page > 0)) ? (+req.query.page) : (-1);

    //фільтр search; використовувати наступним чином: search=something etc.
    let search = (req.query.search !== undefined)?(req.query.search):(-1);

    if(week !== -1) {
        let utc = (req.query.utc !== undefined && !!Number(req.query.utc) && +req.query.utc > -11 && +req.query.utc < 13)?(+req.query.utc):(0);
        stringForFiltering += ` AND (UNIX_TIMESTAMP(execution_date) - UNIX_TIMESTAMP('${week}') < ${604800 - utc*60*60}) AND (UNIX_TIMESTAMP(execution_date) - UNIX_TIMESTAMP('${week}') > ${0 - utc*60*60})`
    }
    else if(month !== -1) {
        stringForFiltering += ` AND execution_date LIKE '${month}%'`;
    }
    else if(year !== -1) {
        stringForFiltering += ` AND execution_date LIKE '${year}%'`;
    }
    
    stringForFiltering += (type !== -1)?(` AND type = '${type}'`):('');
    stringForFiltering += (search !== -1)?(` AND (title LIKE "%${search}%" OR description LIKE "%${search}%")`):('');

    stringForFiltering += ' ORDER BY execution_date';

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

const changeDateToUTC = (utc, executionDate) => {
    let hoursUtc = Math.floor(Math.abs(+utc));
    let minutesUtc = (+utc - Math.floor(+utc))*100;

    var tempstr = executionDate.replace(' ', 'T');
    let tempDate = new Date(tempstr);
    tempDate.setMinutes(tempDate.getMinutes() - tempDate.getTimezoneOffset());

    if(utc < 0) {
        tempDate.setHours(tempDate.getHours() + hoursUtc );
        tempDate.setMinutes(tempDate.getMinutes() + minutesUtc);
    }
    else {
        tempDate.setHours(tempDate.getHours() - hoursUtc );
        tempDate.setMinutes(tempDate.getMinutes() - minutesUtc);
    }

    return tempDate.toISOString().replace('T', ' ').replace('Z', '');
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
                if(result.length !== 0) {
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
                else {
                    return res.status(400).json( {comment: 'Not found'}); 
                }
            }
        });
    }
    createEvent(res, calendarId, userId, utc) {
        let event = {
            title: this.title,
            description: this.description,
            calendar_id: +calendarId,
            execution_date: this.execution_date,
            type: this.type,
            duration: this.duration
        }

        event.execution_date = changeDateToUTC(utc, this.execution_date);

        database.query('SELECT user_id, title, users.email AS email FROM calendars LEFT OUTER JOIN users ON calendars.user_id = users.id' +
            ' WHERE calendars.id = ?', calendarId, (err, result) => {
            if(err) {
                return res.status(400).json( {comment: 'Not found'}); 
            }
            else {
                if(result.length !== 0) {
                    let calendarTitle = result[0].title;
                    let ownerEmail = result[0].email;
                    if(+result[0].user_id === +userId) {
                        if(event.type !== "arrangement") {
                            event.duration = 0;
                        }
                        database.query('INSERT INTO events SET ?', event, (err, result) => {
                            if(err) {
                                return res.status(400).json( {comment: 'Not found'}); 
                            }
                            else {
                                let insertId = result.insertId;
                                database.query('SELECT users_calendars.user_id, users_calendars.role, users.login, users.email FROM users_calendars' +
                                    ' LEFT OUTER JOIN users ON users_calendars.user_id = users.id' +
                                    ' WHERE calendar_id = ?', calendarId, (err, result) => {
                                    if(err) {
                                        return res.status(400).json( {comment: 'Not found'}); 
                                    }
                                    else {
                                        let emailArray = [];
                                        for(let i = 0; i < result.length; i++) {
                                            emailArray.push(result[i].email);
                                        }
                                        createEventNtfc(emailArray, calendarTitle, event.type);
                                        createRemindFunction(insertId, event.execution_date.replace(' ', 'T'), event.type);
                                        return res.status(201).json( {comment: 'Event succesfully created!'});
                                    }
                                })
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
                                            let insertId = result.insertId;
                                            database.query('SELECT users_calendars.user_id, users_calendars.role, users.login, users.email FROM users_calendars' +
                                                ' LEFT OUTER JOIN users ON users_calendars.user_id = users.id' +
                                                ' WHERE calendar_id = ? AND users_calendars.user_id != ?', [calendarId, userId], (err, result) => {
                                                if(err) {
                                                    return res.status(400).json( {comment: 'Not found'}); 
                                                }
                                                else {
                                                    let emailArray = [];
                                                    for(let i = 0; i < result.length; i++) {
                                                        emailArray.push(result[i].email);
                                                    }
                                                    emailArray.push(ownerEmail);
                                                    createEventNtfc(emailArray, calendarTitle, event.type);
                                                    createRemindFunction(insertId, event.execution_date.replace(' ', 'T'), event.type);
                                                    return res.status(201).json( {comment: 'Event succesfully created!'});
                                                }
                                            })
                                        }
                                    })
                                }
                            }
                        })
                        
                    }
                }
                else {
                    return res.status(400).json( {comment: 'Not found'}); 
                }
            }
        });
    }
    changeEvent(res, calendarId, eventId, userId, utc) {
        let event = {
            title: this.title,
            description: this.description,
            execution_date: this.execution_date,
            type: this.type,
            duration: this.duration
        }
        if(event.execution_date !== undefined) {
            event.execution_date = changeDateToUTC(utc, this.execution_date);
        }
        database.query('SELECT user_id, title, users.email AS email FROM calendars LEFT OUTER JOIN users ON calendars.user_id = users.id' +
            ' WHERE calendars.id = ?', calendarId, (err, result) => {
            if(err) {
                return res.status(400).json( {comment: 'Not found'}); 
            }
            else {
                if(result.length !== 0) {
                    let ownerId = result[0].user_id;
                    let ownerEmail = result[0].email;
                    let calendarTitle = result[0].title;
                    database.query('SELECT * FROM events WHERE id = ?', eventId, (err, result) => {
                        if(err) {
                            return res.status(400).json( {comment: 'Not found'}); 
                        }
                        else {
                            if(result.length !== 0) {
                                ///////////////////////////////////////////////
                                //Передивитись зміст повідомлень, які надходять при зміні/створенні/видаленні івенту

                                let oldEventTitle = result[0].title;
                                let oldEventDescription = result[0].description;
                                let oldEventExecutionDate = result[0].execution_date;
                                let oldEventDuration = result[0].duration;
                                let oldEventType = result[0].type;

                                ///////////////////////////
                                if(+ownerId === +userId) {
                                    (event.title === undefined) && (delete event.title);
                                    (event.description === undefined) && (delete event.description);
                                    (event.execution_date === undefined) && (delete event.execution_date);
                                    (event.type === undefined) && (delete event.type);
                                    (event.duration === undefined) && (delete event.duration);
                                    if(event.duration && event.type !== "arrangement") {
                                        event.duration = 0;
                                    }
                                    database.query('UPDATE events SET ? WHERE id = ?', [event, eventId], (err, result) => { 
                                        if(err) {
                                            return res.status(400).json( {comment: 'Not found'}); 
                                        }
                                        else {
                                            database.query('SELECT users_calendars.user_id, users_calendars.role, users.login, users.email FROM users_calendars' +
                                                ' LEFT OUTER JOIN users ON users_calendars.user_id = users.id' +
                                                ' WHERE calendar_id = ?', calendarId, (err, result) => {
                                                if(err) {
                                                    return res.status(400).json( {comment: 'Not found'}); 
                                                }
                                                else {
                                                    let emailArray = [];
                                                    for(let i = 0; i < result.length; i++) {
                                                        emailArray.push(result[i].email);
                                                    }
                                                    database.query('SELECT * FROM events WHERE id = ?', eventId, (err, result) => {
                                                        if(err) {
                                                            return res.status(400).json( {comment: 'Not found'}); 
                                                        }
                                                        else {
                                                            ////////////////////////////////////////////////
                                                            let oldEvent = {};
                                                            oldEvent.title = oldEventTitle;
                                                            oldEvent.description = oldEventDescription;
                                                            oldEvent.execution_date = oldEventExecutionDate;
                                                            oldEvent.duration = oldEventDuration;
                                                            oldEvent.type = oldEventType;
                                                            ////////////////////////////////////////////////
                                                            let newEvent = {};
                                                            newEvent.title = result[0].title;
                                                            newEvent.description = result[0].description;
                                                            newEvent.execution_date = result[0].execution_date;
                                                            newEvent.duration = result[0].duration;
                                                            newEvent.type = result[0].type;

                                                            if(oldEvent.title !== newEvent.title || oldEvent.description !== newEvent.description ||
                                                                (oldEvent.execution_date - newEvent.execution_date) !== 0 || oldEvent.duration !== newEvent.duration ||
                                                                oldEvent.type !== newEvent.type ) {
                                                                changeEventNtfc(emailArray, calendarTitle, oldEvent, newEvent);
                                                                changeRemindFunction(eventId, result[0].execution_date, result[0].type);
                                                            }
                                                            
                                                            return res.status(200).json( {comment: 'Event succesfully changed!'});
                                                        }
                                                    })
                                                }
                                            });
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
                                                if(event.duration && event.type !== "arrangement") {
                                                    event.duration = 0;
                                                }
                                                database.query('UPDATE events SET ? WHERE id = ?', [event, eventId], (err, result) => { 
                                                    if(err) {
                                                        return res.status(400).json( {comment: 'Not found'}); 
                                                    }
                                                    else {
                                                        database.query('SELECT users_calendars.user_id, users_calendars.role, users.login, users.email FROM users_calendars' +
                                                            ' LEFT OUTER JOIN users ON users_calendars.user_id = users.id' +
                                                            ' WHERE calendar_id = ? AND users_calendars.user_id != ?', [calendarId, userId], (err, result) => {
                                                            if(err) {
                                                                return res.status(400).json( {comment: 'Not found'});
                                                            }
                                                            else {
                                                                let emailArray = [];
                                                                for(let i = 0; i < result.length; i++) {
                                                                    emailArray.push(result[i].email);
                                                                }
                                                                emailArray.push(ownerEmail);
                                                                database.query('SELECT * FROM events WHERE id = ?', eventId, (err, result) => {
                                                                    if(err) {
                                                                        return res.status(400).json( {comment: 'Not found'}); 
                                                                    }
                                                                    else {
                                                                        ////////////////////////////////////////////////
                                                                        let oldEvent = {};
                                                                        oldEvent.title = oldEventTitle;
                                                                        oldEvent.description = oldEventDescription;
                                                                        oldEvent.execution_date = oldEventExecutionDate;
                                                                        oldEvent.duration = oldEventDuration;
                                                                        oldEvent.type = oldEventType;
                                                                        ////////////////////////////////////////////////
                                                                        let newEvent = {};
                                                                        newEvent.title = result[0].title;
                                                                        newEvent.description = result[0].description;
                                                                        newEvent.execution_date = result[0].execution_date;
                                                                        newEvent.duration = result[0].duration;
                                                                        newEvent.type = result[0].type;

                                                                        if(oldEvent.title !== newEvent.title || oldEvent.description !== newEvent.description ||
                                                                            (oldEvent.execution_date - newEvent.execution_date) !== 0 || oldEvent.duration !== newEvent.duration ||
                                                                            oldEvent.type !== newEvent.type ) {
                                                                            changeEventNtfc(emailArray, calendarTitle, oldEvent, newEvent);
                                                                            changeRemindFunction(eventId, result[0].execution_date, result[0].type);
                                                                        }
                                                                        
                                                                        return res.status(200).json( {comment: 'Event succesfully changed!'});
                                                                    }
                                                                })
                                                            }
                                                        });
                                                    }
                                                });
                                            }
                                        }
                                    })
                                }
                            }
                            else {
                                return res.status(400).json( {comment: 'Not found'});
                            }
                        }
                    })
                }
                else {
                    return res.status(400).json( {comment: 'Not found'}); 
                }
            }
        });
    }
    getCurrentEventInfo(res, eventId, userId) {
        database.query('SELECT calendars.user_id AS id FROM events LEFT OUTER JOIN calendars ON events.calendar_id = calendars.id' + 
            ' WHERE events.id = ?', eventId, (err, result) => {
            if(err) {
                return res.status(400).json( {comment: 'Not found'});
            }
            else {
                if(result.length !== 0) {
                    if(+result[0].id === +userId) {
                        database.query('SELECT * FROM events WHERE id = ?', eventId, (err, result) => {
                            if(err) {
                                return res.status(400).json( {comment: 'Not found'});
                            }
                            else {
                                return res.status(200).json(result);
                            }
                        })
                    }
                    else {
                        database.query('SELECT users_calendars.user_id FROM events' +
                            ' LEFT OUTER JOIN calendars ON events.calendar_id = calendars.id' +
                            ' LEFT OUTER JOIN users_calendars ON calendars.id = users_calendars.calendar_id' +
                            ' WHERE events.id = ? AND users_calendars.user_id = ?', [eventId, userId], (err, result) => {
                            if(err) {
                                return res.status(400).json( {comment: 'Not found'});
                            }
                            else {
                                if(result.length !== 0) {
                                    database.query('SELECT * FROM events WHERE id = ?', eventId, (err, result) => {
                                        if(err) {
                                            return res.status(400).json( {comment: 'Not found'});
                                        }
                                        else {
                                            return res.status(200).json(result);
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
                else {
                    return res.status(400).json( {comment: 'Not found'});
                }
            }
        })
    }
    deleteEvent(res, calendarId, eventId, userId) {
        database.query('SELECT user_id, title, users.email AS email FROM calendars LEFT OUTER JOIN users ON calendars.user_id = users.id' +
            ' WHERE calendars.id = ?', calendarId, (err, result) => {
            if(err) {
                return res.status(400).json( {comment: 'Not found'}); 
            }
            else {
                if(result.length !== 0) {
                    let ownerId = result[0].user_id;
                    let calendarTitle = result[0].title;
                    let ownerEmail = result[0].email;
                    database.query('SELECT * FROM events WHERE id = ?', eventId, (err, result) => {
                        if(err) {
                            return res.status(400).json( {comment: 'Not found'}); 
                        }
                        else {
                            if(result.length !== 0) {
                                let eventTitle = result[0].title;
                                let eventType = result[0].type;
                                if(+ownerId === +userId) {
                                    database.query('DELETE FROM events WHERE id=?', eventId, (err, result) => {
                                        if(err) {
                                            return res.status(400).json( {comment: 'Not found'}); 
                                        }
                                        else {
                                            database.query('SELECT users_calendars.user_id, users_calendars.role, users.login, users.email FROM users_calendars' +
                                                ' LEFT OUTER JOIN users ON users_calendars.user_id = users.id' +
                                                ' WHERE calendar_id = ?', calendarId, (err, result) => {
                                                if(err) {
                                                    return res.status(400).json( {comment: 'Not found'}); 
                                                }
                                                else {
                                                    let emailArray = [];
                                                    for(let i = 0; i < result.length; i++) {
                                                        emailArray.push(result[i].email);
                                                    }
                                                    deleteEventNtfc(emailArray, calendarTitle, eventTitle, eventType);
                                                    deleteRemindFunction(eventId);
                                                    return res.status(204).json();
                                                }
                                            });
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
                                                        database.query('SELECT users_calendars.user_id, users_calendars.role, users.login, users.email FROM users_calendars' +
                                                            ' LEFT OUTER JOIN users ON users_calendars.user_id = users.id' +
                                                            ' WHERE calendar_id = ? AND users_calendars.user_id != ?', [calendarId, userId], (err, result) => {
                                                            if(err) {
                                                                return res.status(400).json( {comment: 'Not found'}); 
                                                            }
                                                            else {
                                                                let emailArray = [];
                                                                for(let i = 0; i < result.length; i++) {
                                                                    emailArray.push(result[i].email);
                                                                }
                                                                emailArray.push(ownerEmail);
                                                                deleteEventNtfc(emailArray, calendarTitle, eventTitle, eventType);
                                                                deleteRemindFunction(eventId);
                                                                return res.status(204).json();
                                                            }
                                                        })
                                                    }
                                                })
                                            }
                                        }
                                    })
                                }
                            }
                            else {
                                return res.status(400).json( {comment: 'Not found'}); 
                            }
                        }
                    })
                }
                else {
                    return res.status(400).json( {comment: 'Not found'}); 
                }
            }
        });
    }
}