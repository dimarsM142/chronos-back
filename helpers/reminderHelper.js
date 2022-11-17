const { sendRemindByReminder } = require('../helpers/mailHelper');
const database = require('../db');

let checkRemindReminderArray = [];

function checkTimeToReminder(currentCounter, counter, events, sendEventArray) {
    if(currentCounter !== counter) {
        if(events[currentCounter]['UNIX_TIMESTAMP(execution_date)']*1000 - Date.now() < 15 * 1000 && !checkRemindReminderArray.includes(events[currentCounter].event_id)) {
            database.query('SELECT events.notification FROM events WHERE events.id = ?', events[currentCounter].id, (err, result) => {
                if(err) {
                    //console.log(err);
                    //return res.status(400).json( {comment: 'Not found'});
                }
                else {
                    if(+result[0].notification === 0) {
                        database.query('UPDATE events SET ? WHERE events.id = ?', [{notification: 1}, events[currentCounter].id], (err, result) => {
                            if(err) {
                                //return res.status(400).json( {comment: 'Not found'});
                            }
                            else {
                                database.query('SELECT users.email FROM users_calendars' +
                                    ' LEFT OUTER JOIN users ON users.id = users_calendars.user_id' +
                                    ' WHERE calendar_id = ?', events[currentCounter].calendarId, (err, result) => {
                                    if(err) {
                                        //return res.status(400).json( {comment: 'Not found'});
                                    }
                                    else {
                                        let emailArray = [];
                                        for(let i = 0; i < result.length; i++) {
                                            emailArray.push(result[i].email);
                                        }
                                        emailArray.push(events[currentCounter].email);
                                        events[currentCounter].email = emailArray.slice(0);
                                        sendEventArray.push(events[currentCounter]);
                                        checkRemindReminderArray.push(events[currentCounter].id);
                                        if (currentCounter < counter) {
                                            checkTimeToReminder(currentCounter + 1, counter, events, sendEventArray)
                                        }
                                    }
                                })
                            }
                        })
                    }
                    else {
                        checkRemindReminderArray.push(events[currentCounter].id);
                        if (currentCounter < counter) {
                            checkTimeToReminder(currentCounter + 1, counter, events, sendEventArray)
                        }
                    }
                }
            })
        }
        else {
            if (currentCounter < counter) {
                checkTimeToReminder(currentCounter + 1, counter, events, sendEventArray)
            }
        }
    }
    else if (currentCounter === counter) {
        if(sendEventArray.length !== 0) {
            sendRemindByReminder(sendEventArray)
        }
    }
}

const remindRemindersFunction = () => {
    database.query('SELECT UNIX_TIMESTAMP(execution_date), events.title, events.id, calendars.title, calendars.id AS calendarId, users.email FROM events' +
	    ' LEFT OUTER JOIN calendars ON calendars.id = events.calendar_id ' +
        ' LEFT OUTER JOIN users ON users.id = calendars.user_id' + 
        ' WHERE events.type = ?', 'reminder', (err, result) => {
        if(err) {
            //return res.status(400).json( {comment: 'Not found'});
        }
        else {
            if(result.length !== 0) {
                let sendEventArray = [];
                checkTimeToReminder(0, result.length, result, sendEventArray);
            }
        }
    })
}

module.exports = {
    remindRemindersFunction
}

//day 86400
//week 604800
//month 2592000