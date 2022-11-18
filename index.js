require('dotenv').config();
const express =  require('express');
const { authentRouter, 
        calendarRouter,
        eventRouter,
        userRouter } = require('./routes/api/routes');
const { remindTasksFunction } = require('./helpers/taskHelper');
const { remindArrangementsFunction } = require('./helpers/arrangementHelper');
const { remindRemindersFunction } = require('./helpers/reminderHelper');
var fileUpload = require('express-fileupload');


const PORT = process.env.PORT ?? 3001;
const app = express();

const cors = require('cors');
const corsOptions ={
    origin: ['http://192.168.20.251:3000', 'http://localhost:3000'],
    credentials:true,
    methods:["GET" , "POST" , "PUT", "PATCH", "DELETE"],
    optionSuccessStatus:200
}

app.use(fileUpload({}));

app.use(cors(corsOptions));

app.use('/img', express.static('./img'));

app.use(express.json({extended: true}));

app.use('/api', authentRouter);
app.use('/api', calendarRouter);
app.use('/api', eventRouter);
app.use('/api', userRouter);

app.listen(PORT, () => console.log(`Server is started on port: ${PORT}`));

setInterval(remindTasksFunction, 100000);
setInterval(remindArrangementsFunction, 100000);
setInterval(remindRemindersFunction, 10000);
