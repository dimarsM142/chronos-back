const jwt = require('jsonwebtoken');
const {secret} = require('../config');
const database = require('../db');
const Event = require('../models/event');
const { eventCreateValidation,
        eventChangeValidation } = require('../validators/validator');

const getAllEventsFromCurrentCalendar = (req, res) => {
    let month = ((req.query.month).length === 7 && !!Number(+(req.query.month).slice(0, 4)) && (!!Number(+(req.query.month).slice(5, 7)) 
        && (+(req.query.month).slice(5, 7) >= 1 && +(req.query.month).slice(5, 7) <= 12)) && (req.query.month)[4] === '-') ? (req.query.month) : (-1);
    const { calendarId } = req.params;
    const token = req.get('Authorization')
    const payload = jwt.verify(token, secret);
    let event = new Event();
    event.getAllEventsFromCurrentCalendar(res, calendarId, payload.userId, month);
}

const createEventInCurrentCalendar = (req, res) => {
    const {error} = eventCreateValidation(req.body);
    if(error) {
        return res.status(400).json( {comment: error.details[0].message});
    }
    if(req.body.type === "arrangement") {
        if(req.body.duration === undefined) {
            return res.status(400).json( {comment: "duration is required for arrangement"});
        }
    }
    const { calendarId } = req.params;
    const token = req.get('Authorization')
    const payload = jwt.verify(token, secret);
    let event = new Event(req.body.title, req.body.description, req.body.executionDate, req.body.type, req.body.duration);
    console.log(payload);
    event.createEvent(res, calendarId, payload.userId);
}

const changeEventInCurrentCalendar = (req, res) => {
    const {error} = eventChangeValidation(req.body);
    if(error) {
        return res.status(400).json( {comment: error.details[0].message});
    }
    if(req.body.type === "arrangement") {
        if(req.body.duration === undefined) {
            return res.status(400).json( {comment: "duration is required for arrangement"});
        }
    }
    const { calendarId, eventId } = req.params;
    const token = req.get('Authorization')
    const payload = jwt.verify(token, secret);
    let event = new Event(req.body.title, req.body.description, req.body.executionDate, req.body.type, req.body.duration);
    event.changeEvent(res, calendarId, eventId, payload.userId);
}

const deleteEventFromCurrentCalendar = (req, res) => {
    const { calendarId, eventId } = req.params;
    const token = req.get('Authorization')
    const payload = jwt.verify(token, secret);
    let event = new Event();
    event.deleteEvent(res, calendarId, eventId, payload.userId);
}

module.exports = {
    getAllEventsFromCurrentCalendar,
    createEventInCurrentCalendar,
    changeEventInCurrentCalendar,
    deleteEventFromCurrentCalendar
}