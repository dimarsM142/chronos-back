const database = require('../db');
const shedule = require('node-schedule');
const { sendRemindByArrangement,
        sendRemindByTask,
        sendRemindByReminder } = require('../helpers/mailHelper');

const createRemindFunction = (eventId, eventExecDate, eventType) => {
    switch(eventType) {
        case 'arrangement':
            let datesForArrangement = [];
            datesForArrangement[0] = new Date(eventExecDate);
            datesForArrangement[0].setHours(datesForArrangement[0].getHours() - 1);
            datesForArrangement[0] = datesForArrangement[0].toISOString().replace('Z', '');
            /*datesForArrangement[1] = new Date(eventExecDate);
            datesForArrangement[1].setMinutes(datesForArrangement[1].getMinutes() - 30);
            datesForArrangement[1] = datesForArrangement[1].toISOString().replace('Z', '');
            datesForArrangement[2] = new Date(eventExecDate);
            datesForArrangement[2].setMinutes(datesForArrangement[2].getMinutes() - 15);
            datesForArrangement[2] = datesForArrangement[2].toISOString().replace('Z', '');

            for(let i = 0; i < datesForArrangement.length; i++) {
                
            }*/
            shedule.scheduleJob(`${eventId}`, datesForArrangement[0], (err) => {
                database.query('SELECT events.title, calendars.title AS calendarTitle, calendars.id AS calendarId, users.email FROM events' +
                    ' LEFT OUTER JOIN calendars ON calendars.id = events.calendar_id ' +
                    ' LEFT OUTER JOIN users ON users.id = calendars.user_id' + 
                    ' WHERE events.id = ?', eventId, (err, result) => {
                    if(err) {
                        return res.status(400).json( {comment: 'Not found'});
                    }
                    else {
                        let calendarId = result[0].calendarId;
                        let ownerEmail = result[0].email;
                        let calendarTitle = result[0].calendarTitle;
                        let eventTitle = result[0].title;
                        database.query('UPDATE events SET ? WHERE id = ?', [{notification: 1}, eventId], (err, result) => {
                            if(err) {
                                return res.status(400).json( {comment: 'Not found'});
                            }
                            else {
                                database.query('SELECT users.email FROM users_calendars' +
                                    ' LEFT OUTER JOIN users ON users.id = users_calendars.user_id' +
                                    ' WHERE calendar_id = ?', calendarId, (err, result) => {
                                    if(err) {
                                        return res.status(400).json( {comment: 'Not found'});
                                    }
                                    else {
                                        let emailArray = [];
                                        for(let i = 0; i < result.length; i++) {
                                            emailArray.push(result[i].email);
                                        }
                                        emailArray.push(ownerEmail);
                                        sendRemindByArrangement(emailArray, eventTitle, calendarTitle);
                                    }
                                })
                            }
                        })
                    }
                })
            });
            break;
        case 'reminder':
            const dateForReminder = new Date(eventExecDate);
            let dateForReminderToStr = dateForReminder.toISOString().replace('Z', '');

            shedule.scheduleJob(`${eventId}`, dateForReminderToStr, (err) => {
                database.query('SELECT events.title, calendars.title AS calendarTitle, calendars.id AS calendarId, users.email FROM events' +
                    ' LEFT OUTER JOIN calendars ON calendars.id = events.calendar_id ' +
                    ' LEFT OUTER JOIN users ON users.id = calendars.user_id' + 
                    ' WHERE events.id = ?', eventId, (err, result) => {
                    if(err) {
                        return res.status(400).json( {comment: 'Not found'});
                    }
                    else {
                        let calendarId = result[0].calendarId;
                        let ownerEmail = result[0].email;
                        let calendarTitle = result[0].calendarTitle;
                        let eventTitle = result[0].title;
                        database.query('UPDATE events SET ? WHERE id = ?', [{notification: 1}, eventId], (err, result) => {
                            if(err) {
                                return res.status(400).json( {comment: 'Not found'});
                            }
                            else {
                                database.query('SELECT users.email FROM users_calendars' +
                                    ' LEFT OUTER JOIN users ON users.id = users_calendars.user_id' +
                                    ' WHERE calendar_id = ?', calendarId, (err, result) => {
                                    if(err) {
                                        return res.status(400).json( {comment: 'Not found'});
                                    }
                                    else {
                                        let emailArray = [];
                                        for(let i = 0; i < result.length; i++) {
                                            emailArray.push(result[i].email);
                                        }
                                        emailArray.push(ownerEmail);
                                        sendRemindByReminder(emailArray, eventTitle, calendarTitle);
                                    }
                                })
                            }
                        })
                    }
                })
            });
            break;
        case 'task':
            let dateForTask = new Date(eventExecDate);
            dateForTask.setHours(dateForTask.getHours() - 24);
            let dateForTaskToStr = dateForTask.toISOString().replace('Z', '');

            shedule.scheduleJob(`${eventId}`, dateForTaskToStr, (err) => {
                database.query('SELECT events.title, calendars.title AS calendarTitle, calendars.id AS calendarId, users.email FROM events' +
                    ' LEFT OUTER JOIN calendars ON calendars.id = events.calendar_id ' +
                    ' LEFT OUTER JOIN users ON users.id = calendars.user_id' + 
                    ' WHERE events.id = ?', eventId, (err, result) => {
                    if(err) {
                        return res.status(400).json( {comment: 'Not found'});
                    }
                    else {
                        let calendarId = result[0].calendarId;
                        let ownerEmail = result[0].email;
                        let calendarTitle = result[0].calendarTitle;
                        let eventTitle = result[0].title;
                        database.query('UPDATE events SET ? WHERE id = ?', [{notification: 1}, eventId], (err, result) => {
                            if(err) {
                                return res.status(400).json( {comment: 'Not found'});
                            }
                            else {
                                database.query('SELECT users.email FROM users_calendars' +
                                    ' LEFT OUTER JOIN users ON users.id = users_calendars.user_id' +
                                    ' WHERE calendar_id = ?', calendarId, (err, result) => {
                                    if(err) {
                                        return res.status(400).json( {comment: 'Not found'});
                                    }
                                    else {
                                        let emailArray = [];
                                        for(let i = 0; i < result.length; i++) {
                                            emailArray.push(result[i].email);
                                        }
                                        emailArray.push(ownerEmail);
                                        sendRemindByTask(emailArray, eventTitle, calendarTitle);
                                    }
                                })
                            }
                        })
                    }
                })
            });
            break;
        default:
            break;
    }
}

const changeRemindFunction = (eventId, eventExecDate, eventType) => {
    shedule.cancelJob(`${eventId}`);
    createRemindFunction(eventId, eventExecDate, eventType);
}

const deleteRemindFunction = (eventId) => {
    shedule.cancelJob(`${eventId}`);
}

const checkRemindesFunction = () => {
    database.query('SELECT * FROM events WHERE notification != 1', (err, result) => {
        if(err) {
            return res.status(400).json( {comment: 'Not found'});
        }
        else {
            for(let i = 0; i < result.length; i++) {
                createRemindFunction(result[i].id, result[i].execution_date, result[i].type);
            }
        }
    });
}

module.exports = {
    checkRemindesFunction,
    createRemindFunction,
    changeRemindFunction,
    deleteRemindFunction
}