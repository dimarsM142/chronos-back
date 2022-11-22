const jwt = require('jsonwebtoken');
const {secret} = require('../config');
const database = require('../db');
const Calendar = require('../models/calendar');
const { calendarCreateValidation,
        calendarChangeValidation,
        calendarSubscribeValidation,
        calendarChangeSubscribedValidation } = require('../validators/validator');

const getAllOwnCalendarsByCurrentUser = (req, res) => {
    const token = req.get('Authorization')
    const payload = jwt.verify(token, secret);
    let calendar = new Calendar();
    calendar.getAllOwnCurrentUserCalendars(req, res, payload.userId);
}

const getAllCalendarsCurrentUserSubsTo = (req, res) => {
    const token = req.get('Authorization')
    const payload = jwt.verify(token, secret);
    let calendar = new Calendar();
    calendar.getAllCurrentUserSubsToCalendars(req, res, payload.userId);
}

const createCalendarByCurrentUser = (req, res) => {
    const {error} = calendarCreateValidation(req.body);
    if(error) {
        return res.status(400).json( {comment: error.details[0].message});
    }
    const token = req.get('Authorization')
    const payload = jwt.verify(token, secret);
    let calendar = new Calendar(req.body.title, req.body.description);
    calendar.createCalendar(res, payload.userId);
}

const subscribeUserToCurrentUserCalendar = (req, res) => {
    const {error} = calendarSubscribeValidation(req.body);
    if(error) {
        return res.status(400).json( {comment: error.details[0].message});
    }
    const { calendarId } = req.params;
    const token = req.get('Authorization')
    const payload = jwt.verify(token, secret);
    let calendar = new Calendar();
    calendar.subscribeUserToCalendar(res, req.body.userLogin, req.body.role, calendarId, payload.userId);
}

const changeSubscribedUserToCurrentUserCalendar = (req, res) => {
    const {error} = calendarChangeSubscribedValidation(req.body);
    if(error) {
        return res.status(400).json( {comment: error.details[0].message});
    }
    const { calendarId, userId } = req.params;
    const token = req.get('Authorization')
    const payload = jwt.verify(token, secret);
    let calendar = new Calendar();
    calendar.changeSubscribedUserToCalendar(res, userId, req.body.role, calendarId, payload.userId);
}

const getAllUsersSubsedToCurrentCalendar = (req, res) => {
    const { calendarId } = req.params;
    const token = req.get('Authorization')
    const payload = jwt.verify(token, secret);
    let calendar = new Calendar();
    calendar.getAllUsersSubsedToCurrentCalendar(res, calendarId, payload.userId);
}

const unsubscribeUserToCurrentUserCalendar = (req, res) => {
    const { calendarId, userId } = req.params;
    const token = req.get('Authorization')
    const payload = jwt.verify(token, secret);
    let calendar = new Calendar();
    calendar.unsubscribeUserToCalendar(res, userId == 0 ? payload.userId : userId, calendarId, payload.userId);
}

const changeCalendarByCurrentUser = (req, res) => {
    const {error} = calendarChangeValidation(req.body);
    if(error) {
        return res.status(400).json( {comment: error.details[0].message});
    }
    const { calendarId } = req.params;
    const token = req.get('Authorization');
    const payload = jwt.verify(token, secret);
    let calendar = new Calendar(req.body.title, req.body.description);
    calendar.changeCalendar(res, calendarId, payload.userId);
}

const getCurrentUserRoleInCurrentCalendar = (req, res) => {
    const { calendarId } = req.params;
    const token = req.get('Authorization');
    const payload = jwt.verify(token, secret);
    let calendar = new Calendar();
    calendar.getCurrentUserRoleInCurrentCalendar(res, calendarId, payload.userId);
}

const deleteCalendarByCurrentUser = (req, res) => {
    const { calendarId } = req.params;
    const token = req.get('Authorization')
    const payload = jwt.verify(token, secret);
    let calendar = new Calendar();
    calendar.deleteCalendar(res, calendarId, payload.userId);
}

module.exports = {
    getAllOwnCalendarsByCurrentUser,
    getAllCalendarsCurrentUserSubsTo,
    createCalendarByCurrentUser,
    subscribeUserToCurrentUserCalendar,
    changeSubscribedUserToCurrentUserCalendar,
    getAllUsersSubsedToCurrentCalendar,
    unsubscribeUserToCurrentUserCalendar,
    changeCalendarByCurrentUser,
    getCurrentUserRoleInCurrentCalendar,
    deleteCalendarByCurrentUser
}
