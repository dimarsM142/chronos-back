const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport(
    {
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: {
            user: process.env.EMAIL,
            pass: process.env.PASSWORD
        }
    },
    {
        from: `Technical support <${process.env.EMAIL}>`
    }
);

const mailer = message => {
    transporter.sendMail(message, (err, info) => {
        if(err) {
            return res.status(400).json( {comment: 'Not found'});
        }
    });
}

function sendResetPsw(user, token) {
    const message = {
        to: `${user[0]['email']}`,
        subject: 'Password recovery',
        html:`
        <h2>Account password reminder</h2>
        <i>You must follow the link in order to proceed with the password change process.</i>
        <a href="url">http://localhost:3000?tfp=${token}</a>
        <p>After 5 minutes, the link will become invalid.</p>
        <br><br><p>This letter does not require a response.</p>
        `
    }
    mailer(message);
}

function sendRemindByTask(sendEventArray) {
    let mailArray = [];
    for(let i = 0; i < sendEventArray.length; i++) {
        for(let j = 0; j < sendEventArray[i].email.length; j++) {
            mailArray.push(sendEventArray[i].email[j]);
        }
    }
    const message = {
        to: `${mailArray}`,
        subject: 'Prompt',
        html:`
        <h2>Task remind</h2>
        <p>Until tomorrow, you need to complete some task!</p>
        <br><br><p>This letter does not require a response.</p>
        `
    }
    mailer(message);
}

function sendRemindByArrangement(sendEventArray, period) {
    let mailArray = [];
    for(let i = 0; i < sendEventArray.length; i++) {
        for(let j = 0; j < sendEventArray[i].email.length; j++) {
            mailArray.push(sendEventArray[i].email[j]);
        }
    }
    const message = {
        to: `${mailArray}`,
        subject: 'Prompt',
        html:`
        <h2>Arrangement remind</h2>
        <p>There will be some scheduled event in ${period}!</p>
        <br><br><p>This letter does not require a response.</p>
        `
    }
    mailer(message);
}

function sendRemindByReminder(sendEventArray) {
    let mailArray = [];
    for(let i = 0; i < sendEventArray.length; i++) {
        for(let j = 0; j < sendEventArray[i].email.length; j++) {
            mailArray.push(sendEventArray[i].email[j]);
        }
    }
    const message = {
        to: `${mailArray}`,
        subject: 'Prompt',
        html:`
        <h2>Reminder</h2>
        <p>You have planned to do something now!</p>
        <br><br><p>This letter does not require a response.</p>
        `
    }
    mailer(message);
}

module.exports = {
    sendResetPsw,
    sendRemindByTask,
    sendRemindByArrangement,
    sendRemindByReminder
}
