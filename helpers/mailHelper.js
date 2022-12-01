const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth:{
        user: 'mostlycloudy220@gmail.com',
        pass:'wnhoemtdkukekyhd'
    }
});

const mailer = message => {
    transporter.sendMail(message, (err, info) => {
        if(err) {
            console.log(err);
        }
    });
}

function sendResetPsw(user, token) {
    const message = {
        from: 'mostlycloudy220@gmail.com',
        to: `${user[0]['email']}`,
        subject: 'Password recovery',
        html:`
        <html>
            <head>
                <style>
                    body { 
                        font-family: 'Didact Gothic', sans-serif;
                        margin: 0px 40px;
                    }
                    p {
                        padding: 0px;
                        margin: 0px;
                        
                    }
                    h1 {
                        text-align: center;
                        font-size: 36px;
                        font-family: 'Comfortaa', cursive;
                        color: green;
                    }
                    img {
                        margin:auto;
                        width: 100px;
                        height: 100px;
                    }
                    .header {
                        display: grid;
                        justify-content: center;
                        row-gap: 20px;
                    }
                    h2 {
                        font-weight: 700;
                        font-size: 20px;
                        opacity: 0.6;
                        margin-top: 30px;
                        margin-bottom: 30px;   
                    }
                    .text-content {
                        opacity: 0.6;
                        padding: 10px 20px;
                        font-size: 18px;
                        margin-bottom: 20px;
                    }
                    .link {
                        margin: auto;
                        text-align: center;
                        margin-bottom: 20px;
                    }
                    .link a {
                        text-transform: none;
                        text-decoration: none;
                        color: white;
                        background-color: green;
                        font-family: 'Comfortaa', cursive;
                        text-transform: uppercase;
                        font-size: 30px;
                        padding: 5px 30px;
                        transition: 0.4s;
                        
                    }
                    .link a:hover{
                        background-color: rgb(23, 88, 3);
                    }
                    .link a:active{
                        background-color: rgb(0, 150, 12);
                        color: #ffffff;
                        box-shadow: 10px 15px 15px rgb(112, 112, 112);
                    }
                    .last-part {
                        text-align: right;
                        opacity: 0.7;
                        font-size: 24px;
                        margin-top: 40px;
                        color: green;
                    }
                </style>
            </head>
            <body>
                <div class="header">
                    <h1>Chronos</h1>
                    <img className="logo" src='https://www.pngkey.com/png/full/18-180664_calendar-clock-comments-time-and-date-icon-png.png' alt='logo'/>
                </div>
                <div>

                    <h2>Account password reminder</h2>
                    <p class="text-content">You must follow the link in order to proceed with the password change process. After 5 minutes, the link will become invalid.</p>

                    <div class="link">
                        <a href="https://chron0s.herokuapp.com/forgot-password/${token}">Reset Password</a>
                    </div>
                    <p class="last-part">Enjoy, the rest of your day!</p>
                </div>
            </body>
        </html>
        `
        
    }
    mailer(message);
}

function sendRemindByTask(sendEventArray, eventTitle, calendarTitle) {
    const message = {
        from: 'mostlycloudy220@gmail.com',
        to: `${sendEventArray}`,
        subject: 'Chronos. Task notification!',
        html:`
        <html>
            <head>
                <style>
                    body { 
                        font-family: 'Didact Gothic', sans-serif;
                        margin: 0px 40px;
                    }
                    p {
                        padding: 0px;
                        margin: 0px;
                        
                    }
                    h1 {
                        text-align: center;
                        font-size: 36px;
                        font-family: 'Comfortaa', cursive;
                        color: green;
                    }
                    img {
                        margin:auto;
                        width: 100px;
                        height: 100px;
                    }
                    .header {
                        display: grid;
                        justify-content: center;
                        row-gap: 20px;
                    }
                    h2 {
                        font-weight: 700;
                        font-size: 20px;
                        opacity: 0.6;
                        margin-top: 30px;
                        margin-bottom: 30px;   
                    }
                    .text-content {
                        opacity: 0.6;
                        padding: 10px 20px;
                        font-size: 18px;
                        margin-bottom: 20px;
                    }
                    .link {
                        margin: auto;
                        text-align: center;
                        margin-bottom: 20px;
                    }
                    .link a {
                        text-transform: none;
                        text-decoration: none;
                        color: white;
                        background-color: green;
                        font-family: 'Comfortaa', cursive;
                        text-transform: uppercase;
                        font-size: 30px;
                        padding: 5px 30px;
                        transition: 0.4s;
                        
                    }
                    .link a:hover{
                        background-color: rgb(23, 88, 3);
                    }



                    .link a:active{
                        background-color: rgb(0, 150, 12);
                        color: #ffffff;
                        box-shadow: 10px 15px 15px rgb(112, 112, 112);
                    }
                    .last-part {
                        text-align: right;
                        opacity: 0.7;
                        font-size: 24px;
                        margin-top: 40px;
                        color: green;
                    }
                    .text-calendarTitle {
                        text-align: center;
                        margin-bottom: 20px;
                    }
                    .text-calendarTitle .title{
                        margin-right: 10px;
                        opacity: 0.3;
                        font-size: 20px;
                    }
                    .text-calendarTitle .content{
                        text-transform: uppercase;
                        color: green;
                        font-size: 30px;
                        font-weight: 700;
                        font-family: 'Comfortaa', cursive;
                    }
                    .text-eventTitle{
                        opacity: 1;
                        color: black;
                        font-size: 24px;
                        color: green;
                        font-style: italic;
                    
                    }
                    
                </style>
            </head>
            <body>
                <div class="header">
                    <h1>Chronos</h1>
                    <img className="logo" src='https://www.pngkey.com/png/full/18-180664_calendar-clock-comments-time-and-date-icon-png.png' alt='logo'/>
                </div>
                <div>
                    <h2>Task notification</h2>
                    <p class="text-calendarTitle"><span class="title">calendar</span><span class="content">${calendarTitle}</span></p>
                    <p class="text-content">You have event - <span class="text-eventTitle">${eventTitle}</span> to complete. Deadline - tomorrow! For more details, see this calendar on the website.</p>
                        <div class="link">
                            <a href="https://chron0s.herokuapp.com">Go into website!</a>
                        </div>
                
                    <p class="last-part">Enjoy, the rest of your day!</p>
                </div>
            </body>
        </html>
        `
    }
    mailer(message);
}

function sendRemindByArrangement(sendEventArray, eventTitle, calendarTitle) {
    const message = {
        from: 'mostlycloudy220@gmail.com',
        to: `${sendEventArray}`,
        subject: 'Chronos. Arrangement notification!',
        html:`
        <html>
            <head>
                <style>
                    body { 
                        font-family: 'Didact Gothic', sans-serif;
                        margin: 0px 40px;
                    }
                    p {
                        padding: 0px;
                        margin: 0px;
                        
                    }
                    h1 {
                        text-align: center;
                        font-size: 36px;
                        font-family: 'Comfortaa', cursive;
                        color: green;
                    }
                    img {
                        margin:auto;
                        width: 100px;
                        height: 100px;
                    }
                    .header {
                        display: grid;
                        justify-content: center;
                        row-gap: 20px;
                    }
                    h2 {
                        font-weight: 700;
                        font-size: 20px;
                        opacity: 0.6;
                        margin-top: 30px;
                        margin-bottom: 30px;   
                    }
                    .text-content {
                        opacity: 0.6;
                        padding: 10px 20px;
                        font-size: 18px;
                        margin-bottom: 20px;
                    }
                    .link {
                        margin: auto;
                        text-align: center;
                        margin-bottom: 20px;
                    }
                    .link a {
                        text-transform: none;
                        text-decoration: none;
                        color: white;
                        background-color: green;
                        font-family: 'Comfortaa', cursive;
                        text-transform: uppercase;
                        font-size: 30px;
                        padding: 5px 30px;
                        transition: 0.4s;
                        
                    }
                    .link a:hover{
                        background-color: rgb(23, 88, 3);
                    }



                    .link a:active{
                        background-color: rgb(0, 150, 12);
                        color: #ffffff;
                        box-shadow: 10px 15px 15px rgb(112, 112, 112);
                    }
                    .last-part {
                        text-align: right;
                        opacity: 0.7;
                        font-size: 24px;
                        margin-top: 40px;
                        color: green;
                    }
                    .text-calendarTitle {
                        text-align: center;
                        margin-bottom: 20px;
                    }
                    .text-calendarTitle .title{
                        margin-right: 10px;
                        opacity: 0.3;
                        font-size: 20px;
                    }
                    .text-calendarTitle .content{
                        text-transform: uppercase;
                        color: green;
                        font-size: 30px;
                        font-weight: 700;
                        font-family: 'Comfortaa', cursive;
                    }
                    .text-eventTitle{
                        opacity: 1;
                        color: black;
                        font-size: 24px;
                        color: green;
                        font-style: italic;
                    
                    }
                    
                </style>
            </head>
            <body>
                <div class="header">
                    <h1>Chronos</h1>
                    <img className="logo" src='https://www.pngkey.com/png/full/18-180664_calendar-clock-comments-time-and-date-icon-png.png' alt='logo'/>
                </div>
                <div>
                    <h2>Arrangament notification</h2>
                    <p class="text-calendarTitle"><span class="title">calendar</span><span class="content">${calendarTitle}</span></p>
                    <p class="text-content">In 1 hour, an event <span class="text-eventTitle">${eventTitle}</span> will occur in this calendar! For more details, see this calendar on the website.</p>
                        <div class="link">
                            <a href="https://chron0s.herokuapp.com">Go into website!</a>
                        </div>
                
                    <p class="last-part">Enjoy, the rest of your day!</p>
                </div>
            </body>
        </html>
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
        from: 'mostlycloudy220@gmail.com',
        to: `${sendEventArray}`,
        subject: 'Chronos. Reminder notification!',
        html:`
        <html>
            <head>
                <style>
                    body { 
                        font-family: 'Didact Gothic', sans-serif;
                        margin: 0px 40px;
                    }
                    p {
                        padding: 0px;
                        margin: 0px;
                        
                    }
                    h1 {
                        text-align: center;
                        font-size: 36px;
                        font-family: 'Comfortaa', cursive;
                        color: green;
                    }
                    img {
                        margin:auto;
                        width: 100px;
                        height: 100px;
                    }
                    .header {
                        display: grid;
                        justify-content: center;
                        row-gap: 20px;
                    }
                    h2 {
                        font-weight: 700;
                        font-size: 20px;
                        opacity: 0.6;
                        margin-top: 30px;
                        margin-bottom: 30px;   
                    }
                    .text-content {
                        opacity: 0.6;
                        padding: 10px 20px;
                        font-size: 18px;
                        margin-bottom: 20px;
                    }
                    .link {
                        margin: auto;
                        text-align: center;
                        margin-bottom: 20px;
                    }
                    .link a {
                        text-transform: none;
                        text-decoration: none;
                        color: white;
                        background-color: green;
                        font-family: 'Comfortaa', cursive;
                        text-transform: uppercase;
                        font-size: 30px;
                        padding: 5px 30px;
                        transition: 0.4s;
                        
                    }
                    .link a:hover{
                        background-color: rgb(23, 88, 3);
                    }



                    .link a:active{
                        background-color: rgb(0, 150, 12);
                        color: #ffffff;
                        box-shadow: 10px 15px 15px rgb(112, 112, 112);
                    }
                    .last-part {
                        text-align: right;
                        opacity: 0.7;
                        font-size: 24px;
                        margin-top: 40px;
                        color: green;
                    }
                    .text-calendarTitle {
                        text-align: center;
                        margin-bottom: 20px;
                    }
                    .text-calendarTitle .title{
                        margin-right: 10px;
                        opacity: 0.3;
                        font-size: 20px;
                    }
                    .text-calendarTitle .content{
                        text-transform: uppercase;
                        color: green;
                        font-size: 30px;
                        font-weight: 700;
                        font-family: 'Comfortaa', cursive;
                    }
                    .text-eventTitle{
                        opacity: 1;
                        color: black;
                        font-size: 24px;
                        color: green;
                        font-style: italic;
                    
                    }
                    
                </style>
            </head>
            <body>
                <div class="header">
                    <h1>Chronos</h1>
                    <img className="logo" src='https://www.pngkey.com/png/full/18-180664_calendar-clock-comments-time-and-date-icon-png.png' alt='logo'/>
                </div>
                <div>
                    <h2>Reminder notification</h2>
                    <p class="text-calendarTitle"><span class="title">calendar</span><span class="content">${calendarTitle}</span></p>
                    <p class="text-content">We remind you that you should have done an event - <span class="text-eventTitle">${eventTitle}</span>. For more details, see this calendar on the website.</p>
                        <div class="link">
                            <a href="https://chron0s.herokuapp.com">Go into website!</a>
                        </div>
                
                    <p class="last-part">Enjoy, the rest of your day!</p>
                </div>
            </body>
        </html>
        `
    }
    mailer(message);
}

function createEventNtfc(sendEventArray, calendarTitle, eventType) {
    const message = {
        from: 'mostlycloudy220@gmail.com',
        to: `${sendEventArray}`,
        subject: 'Chronos. New event created!',
        html:`
        <html>
            <head>
                <style>
                    body { 
                        font-family: 'Didact Gothic', sans-serif;
                        margin: 0px 40px;
                    }
                    p {
                        padding: 0px;
                        margin: 0px;
                        
                    }
                    h1 {
                        text-align: center;
                        font-size: 36px;
                        font-family: 'Comfortaa', cursive;
                        color: green;
                    }
                    img {
                        margin:auto;
                        width: 100px;
                        height: 100px;
                    }
                    .header {
                        display: grid;
                        justify-content: center;
                        row-gap: 20px;
                    }
                    h2 {
                        font-weight: 700;
                        font-size: 20px;
                        opacity: 0.6;
                        margin-top: 30px;
                        margin-bottom: 30px;   
                    }
                    .text-content {
                        opacity: 0.6;
                        padding: 10px 20px;
                        font-size: 18px;
                        margin-bottom: 20px;
                    }
                    .link {
                        margin: auto;
                        text-align: center;
                        margin-bottom: 20px;
                    }
                    .link a {
                        text-transform: none;
                        text-decoration: none;
                        color: white;
                        background-color: green;
                        font-family: 'Comfortaa', cursive;
                        text-transform: uppercase;
                        font-size: 30px;
                        padding: 5px 30px;
                        transition: 0.4s;
                        
                    }
                    .link a:hover{
                        background-color: rgb(23, 88, 3);
                    }
                    .link a:active{
                        background-color: rgb(0, 150, 12);
                        color: #ffffff;
                        box-shadow: 10px 15px 15px rgb(112, 112, 112);
                    }
                    .last-part {
                        text-align: right;
                        opacity: 0.7;
                        font-size: 24px;
                        margin-top: 40px;
                        color: green;
                    }
                    .text-calendarTitle {
                        text-align: center;
                        margin-bottom: 20px;
                    }
                    .text-calendarTitle .title{
                        margin-right: 10px;
                        opacity: 0.3;
                        font-size: 20px;
                    }
                    .text-calendarTitle .content{
                        text-transform: uppercase;
                        color: green;
                        font-size: 30px;
                        font-weight: 700;
                        font-family: 'Comfortaa', cursive;
                    }
                    .text-eventTitle{
                        opacity: 1;
                        color: black;
                        font-size: 24px;
                        color: green;
                        font-style: italic;
                    
                    }
                    
                </style>
            </head>
            <body>
                <div class="header">
                    <h1>Chronos</h1>
                    <img className="logo" src='https://www.pngkey.com/png/full/18-180664_calendar-clock-comments-time-and-date-icon-png.png' alt='logo'/>
                </div>
                <div>
                    <h2>Event notification</h2>
                    <p class="text-calendarTitle"><span class="title">calendar</span><span class="content">${calendarTitle}</span></p>
                    <p class="text-content">A new event - <span class="text-eventTitle">${eventType}</span> has appeared in this calendar. For more details, see this calendar on the website.</p>
                        <div class="link">
                            <a href="https://chron0s.herokuapp.com">Go into website!</a>
                        </div>
                
                    <p class="last-part">Enjoy, the rest of your day!</p>
                </div>
            </body>
        </html>
        `
    }
    mailer(message);
}

function changeEventNtfc(sendEventArray, calendarTitle, oldEvent, newEvent) { //.toISOString().replace('T', ' ').replace('Z', '')
    const message = {
        from: 'mostlycloudy220@gmail.com',
        to: `${sendEventArray}`,
        subject: 'Chronos. One event changed!',
        html:`
        <html>
        <head>
            <style>
                body { 
                    font-family: 'Didact Gothic', sans-serif;
                    margin: 0px 40px;
                }
                p {
                    padding: 0px;
                    margin: 0px;
                    
                }
                h1 {
                    text-align: center;
                    font-size: 36px;
                    font-family: 'Comfortaa', cursive;
                    color: green;
                }
                img {
                    margin:auto;
                    width: 100px;
                    height: 100px;
                }
                .header {
                    display: grid;
                    justify-content: center;
                    row-gap: 20px;
                }
                h2 {
                    font-weight: 700;
                    font-size: 20px;
                    color: rgba(0, 0, 0, 0.6);
                    margin-top: 30px;
                    margin-bottom: 30px;   
                }
                h2 .oldEvent-type{
                    font-weight: 700;
                    color: black;
                    text-transform: uppercase;
                    font-size: 22px;
                    margin-right: 5px;
                }
                h2 .oldEvent-content{
                    font-size: 24px;
                    color: green;
                    font-style: italic;
                    font-weight: 700;
                }
                .text-content {
                    opacity: 0.6;
                    padding: 10px 20px;
                    font-size: 18px;
                    margin-bottom: 20px;
                }
                .link {
                    margin: auto;
                    text-align: center;
                    margin-bottom: 20px;
                }
                .link a {
                    text-transform: none;
                    text-decoration: none;
                    color: white;
                    background-color: green;
                    font-family: 'Comfortaa', cursive;
                    text-transform: uppercase;
                    font-size: 30px;
                    padding: 5px 30px;
                    transition: 0.4s;
                    
                }
                .link a:hover{
                    background-color: rgb(23, 88, 3);
                }
                .link a:active{
                    background-color: rgb(0, 150, 12);
                    color: #ffffff;
                    box-shadow: 10px 15px 15px rgb(112, 112, 112);
                }
                .last-part {
                    text-align: right;
                    opacity: 0.7;
                    font-size: 24px;
                    margin-top: 40px;
                    color: green;
                }
                .text-calendarTitle {
                    text-align: center;
                    margin-bottom: 20px;
                }
                .text-calendarTitle .title{
                    margin-right: 10px;
                    opacity: 0.3;
                    font-size: 20px;
                }
                .text-calendarTitle .content{
                    text-transform: uppercase;
                    color: green;
                    font-size: 30px;
                    font-weight: 700;
                    font-family: 'Comfortaa', cursive;
                }
                .text-eventTitle{
                    opacity: 1;
                    color: black;
                    font-size: 24px;
                    color: green;
                    font-style: italic;
                
                }
                .one-event{
                    border: 3px solid green;
                    padding: 20px;
                }
                .one-event .date{
                    text-align: right;
                    opacity: 0.5;
                    margin-bottom: 10px;
                }
                .one-event .type{
                    text-transform: uppercase;
                    font-weight: 700;
                    font-size: 24px;
                    margin-bottom: 10px;
                }
                .one-event .title {
                    color: green;
                    font-family: 'Comfortaa', cursive;
                    text-align: center;
                    font-size: 24px;
                    margin-top: 5px;
                    margin-bottom: 20px;
                }
                .one-event .desc {
                    opacity: 0.7;
                    font-size: 18px;
                    margin-bottom: 20px;
    
                }
                .one-event .duration {
                    font-size: 20px;
                    text-align: center;
                }
                
            </style>
        </head>
        <body>
            <div class="header">
                <h1>Chronos</h1>
                <img className="logo" src='https://www.pngkey.com/png/full/18-180664_calendar-clock-comments-time-and-date-icon-png.png' alt='logo'/>
            </div>
            <div>
                <h2><span class="oldEvent-type">${oldEvent.type}</span> <span class="oldEvent-content">${oldEvent.title}</span> was chaged!</h2>
                <p class="text-calendarTitle"><span class="title">calendar</span><span class="content">${calendarTitle}</span></p>
                <p class="text-content">The new look of this event:</p>
                <div class="one-event">
                    <p class="date">${newEvent.execution_date.toISOString().replace('T', ' ').replace('Z', '').slice(0, 16)}</p>
                    <p class="type">${newEvent.type}</p>
                    <p class="title">${newEvent.title}</p> 
                    <p class="desc">${newEvent.description}</p>
                   
                    <p class="duration">${(newEvent.type !== 'arrangement')?(''):`Lasts ${(newEvent.duration / 3600)} hours`}</p>
                    
                </div>
                <div class="link">
                    <a href="https://chron0s.herokuapp.com">Go into website!</a>
                </div>
                <p class="last-part">Enjoy, the rest of your day!</p>
            </div>
        </body>
    </html>
        `
    }
    mailer(message);
}

function deleteEventNtfc(sendEventArray, calendarTitle, eventTitle, eventType) {
    const message = {
        from: 'mostlycloudy220@gmail.com',
        to: `${sendEventArray}`,
        subject: 'Chronos. Canceled event!',
        html:`
        <html>
            <head>
                <style>
                    body { 
                        font-family: 'Didact Gothic', sans-serif;
                        margin: 0px 40px;
                    }
                    p {
                        padding: 0px;
                        margin: 0px;
                        
                    }
                    h1 {
                        text-align: center;
                        font-size: 36px;
                        font-family: 'Comfortaa', cursive;
                        color: green;
                    }
                    img {
                        margin:auto;
                        width: 100px;
                        height: 100px;
                    }
                    .header {
                        display: grid;
                        justify-content: center;
                        row-gap: 20px;
                    }
                    h2 {
                        font-weight: 700;
                        font-size: 20px;
                        opacity: 0.6;
                        margin-top: 30px;
                        margin-bottom: 30px;   
                    }
                    .text-content {
                        color: rgba(0, 0, 0, 0.7);
                        padding: 10px 20px;
                        font-size: 18px;
                        margin-bottom: 20px;
                    }
                    .link {
                        margin: auto;
                        text-align: center;
                        margin-bottom: 20px;
                    }
                    .link a {
                        text-transform: none;
                        text-decoration: none;
                        color: white;
                        background-color: green;
                        font-family: 'Comfortaa', cursive;
                        text-transform: uppercase;
                        font-size: 30px;
                        padding: 5px 30px;
                        transition: 0.4s;
                        
                    }
                    .link a:hover{
                        background-color: rgb(23, 88, 3);
                    }
                    .link a:active{
                        background-color: rgb(0, 150, 12);
                        color: #ffffff;
                        box-shadow: 10px 15px 15px rgb(112, 112, 112);
                    }
                    .last-part {
                        text-align: right;
                        opacity: 0.7;
                        font-size: 24px;
                        margin-top: 40px;
                        color: green;
                    }
                    .text-calendarTitle {
                        text-align: center;
                        margin-bottom: 20px;
                    }
                    .text-calendarTitle .title{
                        margin-right: 10px;
                        opacity: 0.3;
                        font-size: 20px;
                    }
                    .text-calendarTitle .content{
                        text-transform: uppercase;
                        color: green;
                        font-size: 30px;
                        font-weight: 700;
                        font-family: 'Comfortaa', cursive;
                    }
                    .text-content .text-eventType{
                        font-weight: 700;
                        color: black;
                        text-transform: uppercase;
                        font-size: 24px;
                    }
                    .text-eventTitle{
                        opacity: 1;
                        font-size: 24px;
                        color: green;
                        font-style: italic;
                        font-weight: 700;
                    }
                    
                </style>
            </head>
            <body>
                <div class="header">
                    <h1>Chronos</h1>
                    <img className="logo" src='https://www.pngkey.com/png/full/18-180664_calendar-clock-comments-time-and-date-icon-png.png' alt='logo'/>
                </div>
                <div>
                    <h2>Event notification</h2>
                    <p class="text-calendarTitle"><span class="title">calendar</span><span class="content">${calendarTitle}</span></p>
                    <p class="text-content"><span class="text-eventType">${eventType}</span> <span class="text-eventTitle">${eventTitle}</span> in this calendar was canceled :( For more details, see this calendar on the website.</p>
                        <div class="link">
                            <a href="https://chron0s.herokuapp.com">Go into website!</a>
                        </div>
                
                    <p class="last-part">Enjoy, the rest of your day!</p>
                </div>
            </body>
        </html>
        `,
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
