const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth:{
        user: 'dimonars11032003@gmail.com',
        pass:'ejlguxmwvxxsfkxq'
    }
});

const mailer = message => {
    transporter.sendMail(message, (err, info) => {
        if(err) {
            return res.status(400).json( {comment: 'Not found'});
        }
    });
}

function sendResetPsw(user, token) {
    const message = {
        from: 'dimonars11032003@gmail.com',
        to: `${user[0]['email']}`,
        subject: 'Password recovery',
        html:`
        <h2>Account password reminder</h2>
        <i>You must follow the link in order to proceed with the password change process.</i>
        <a href="url">http://localhost:3000/forgot-password/${token}</a>
        <p>After 5 minutes, the link will become invalid.</p>
        <br><br><p>This letter does not require a response.</p>
        `
    }
    mailer(message);
}

function sendRemindByTask(sendEventArray, eventTitle, calendarTitle) {
    const message = {
        from: 'dimonars11032003@gmail.com',
        to: `${sendEventArray}`,
        subject: 'Prompt',
        html:`
        <h2>Task remind</h2>
        <p>According to "${calendarTitle}" calendar, you have "${eventTitle}" to complete. Deadline - tomorrow!</p>
        <br><br><p>This letter does not require a response.</p>
        `
    }
    mailer(message);
}

function sendRemindByArrangement(sendEventArray, eventTitle, calendarTitle) {
    const message = {
        from: 'dimonars11032003@gmail.com',
        to: `${sendEventArray}`,
        subject: 'Prompt',
        html:`
        <h2>Arrangement remind</h2>
        <p>In 1 hour, an event "${eventTitle}" will occur in the calendar "${calendarTitle}"!</p>
        <br><br><p>This letter does not require a response.</p>
        `
    }
    mailer(message);
}

function sendRemindByReminder(sendEventArray, eventTitle, calendarTitle) {
    /*let mailArray = [];
    for(let i = 0; i < sendEventArray.length; i++) {
        for(let j = 0; j < sendEventArray[i].email.length; j++) {
            mailArray.push(sendEventArray[i].email[j]);
        }
    }*/
    const message = {
        from: 'dimonars11032003@gmail.com',
        to: `${sendEventArray}`,
        subject: 'Prompt',
        html:`
        <h2>Reminder</h2>
        <p>According to "${calendarTitle}" calendar, need to take "${eventTitle}" now</p>
        <br><br><p>This letter does not require a response.</p>
        `
    }
    mailer(message);
}

function createEventNtfc(sendEventArray, calendarTitle, eventType) {
    const message = {
        from: 'dimonars11032003@gmail.com',
        to: `${sendEventArray}`,
        subject: 'Prompt',
        html:`
        <h2>Notification</h2>
        <p>A new ${eventType} has appeared in the "${calendarTitle}" calendar</p>
        <br><br><p>This letter does not require a response.</p>
        `
    }
    mailer(message);
}

function changeEventNtfc(sendEventArray, calendarTitle, oldEvent, newEvent) { //.toISOString().replace('T', ' ').replace('Z', '')
    const message = {
        from: 'dimonars11032003@gmail.com',
        to: `${sendEventArray}`,
        subject: 'Prompt',
        html:`
        <h2>Notification</h2>
        <p>${oldEvent.type[0].toUpperCase() + oldEvent.type.slice(1)} "${oldEvent.title}" in calendar "${calendarTitle}" was changed</p>
        <p>Current information about this:<br></p>
        <p>Title: ${newEvent.title}, description: ${newEvent.description}, execution date: ${newEvent.execution_date.toISOString().replace('T', ' ').replace('Z', '').slice(0, 16)},
        ${(newEvent.type !== 'arrangement')?(''):(`duration: ${newEvent.duration},`)} type: ${newEvent.type}</p>
        <br><br><p>This letter does not require a response.</p>
        `
    }
    mailer(message);
}

function deleteEventNtfc(sendEventArray, calendarTitle, eventTitle, eventType) {
    const message = {
        from: 'dimonars11032003@gmail.com',
        to: `${sendEventArray}`,
        subject: 'Prompt',
        html:`
        <h2>Notification</h2>
        <p>${eventType[0].toUpperCase() + eventType.slice(1)} "${eventTitle}" in calendar "${calendarTitle}" was deleted</p>
        <br><br><p>This letter does not require a response.</p>
        `
    }
    mailer(message);
}

module.exports = {
    sendResetPsw,
    sendRemindByTask,
    sendRemindByArrangement,
    sendRemindByReminder,
    createEventNtfc,
    changeEventNtfc,
    deleteEventNtfc
}
