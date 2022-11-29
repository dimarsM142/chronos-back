const jwt = require('jsonwebtoken');
const {secret} = require('../config');
const database = require('../db');
const Event = require('../models/event');
const { eventCreateValidation,
        eventChangeValidation } = require('../validators/validator');

const getAllEventsFromCurrentCalendar = (req, res) => {
    const { calendarId } = req.params;
    const token = req.get('Authorization');
    const payload = jwt.verify(token, secret);
    let event = new Event();
    event.getAllEventsFromCurrentCalendar(req, res, calendarId, payload.userId);
}

const createEventInCurrentCalendar = (req, res) => {
    /*const {error} = eventCreateValidation(req.body);
    if(error) {
        return res.status(400).json( {comment: error.details[0].message});
    }
    */
    if(req.body.type === "arrangement") {
        if(req.body.duration === undefined) {
            return res.status(400).json( {comment: "duration is required for arrangement"});
        }
        if(req.body.subscribers === undefined) {
            return res.status(400).json( {comment: "subscribers is required for arrangement"});
        }
    }
    const { calendarId } = req.params;
    const token = req.get('Authorization')
    const payload = jwt.verify(token, secret);
    let event = new Event(req.body.title, req.body.description, req.body.executionDate, req.body.type, req.body.category, req.body.duration);
    event.createEvent(res, calendarId, payload.userId, +req.body.utc, (req.body.subscribers !== undefined)?((req.body.subscribers.length === 0)?([]):(req.body.subscribers.split(','))):(req.body.subscribers));
}

const changeEventInCurrentCalendar = (req, res) => {
    /*const {error} = eventChangeValidation(req.body);
    if(error) {
        return res.status(400).json( {comment: error.details[0].message});
    }
    if(req.body.type === "arrangement") {
        if(req.body.duration === undefined) {
            return res.status(400).json( {comment: "duration is required for arrangement"});
        }
        if(req.body.subscribers === undefined) {
            return res.status(400).json( {comment: "subscribers is required for arrangement"});
        }
    }*/
    const { calendarId, eventId } = req.params;
    const token = req.get('Authorization')
    const payload = jwt.verify(token, secret);
    let event = new Event(req.body.title, req.body.description, req.body.executionDate, req.body.type, req.body.category, req.body.duration);
    event.changeEvent(res, calendarId, eventId, payload.userId, +req.body.utc, (req.body.subscribers !== undefined)?((req.body.subscribers.length === 0)?([]):(req.body.subscribers.split(','))):(req.body.subscribers));
}

const getCurrentEventInfo = (req, res) => {
    const { eventId } = req.params;
    const token = req.get('Authorization');
    const payload = jwt.verify(token, secret);
    let event = new Event();
    event.getCurrentEventInfo(res, eventId, payload.userId);
}

const getAllUsersInvitedToArrangement = (req, res) => {
    const { calendarId, eventId } = req.params;
    const token = req.get('Authorization');
    const payload = jwt.verify(token, secret);
    let event = new Event();
    event.getAllUsersInvitedToArrangement(res, calendarId, eventId, payload.userId);
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
    getCurrentEventInfo,
    getAllUsersInvitedToArrangement,
    deleteEventFromCurrentCalendar
}