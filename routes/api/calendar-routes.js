const express = require('express');
const checkTokenMiddleware = require('../../middleware/auth');
const { getAllOwnCalendarsByCurrentUser,
        getAllCalendarsCurrentUserSubsTo,
        createCalendarByCurrentUser,
        changeCalendarByCurrentUser,
        deleteCalendarByCurrentUser,
        subscribeUserToCurrentUserCalendar,
        changeSubscribedUserToCurrentUserCalendar,
        getAllUsersSubsedToCurrentCalendar,
        getCurrentUserRoleInCurrentCalendar,
        unsubscribeUserToCurrentUserCalendar } = require('../../controllers/calendar-controller');

const router = express.Router();

router.get('/calendars/own', checkTokenMiddleware, getAllOwnCalendarsByCurrentUser);                                      //Отримати усі власні календарі
router.get('/calendars/subsTo', checkTokenMiddleware, getAllCalendarsCurrentUserSubsTo)                                   //Отримати усі календарі, на які підписаний поточний користувач
router.post('/calendars', checkTokenMiddleware, createCalendarByCurrentUser);                                             //Створити календар
router.post('/calendars/:calendarId/subscribe', checkTokenMiddleware, subscribeUserToCurrentUserCalendar);                //Підписати користувача на власний календар поточного користувача
router.patch('/calendars/:calendarId/subscribe/:userId', checkTokenMiddleware, changeSubscribedUserToCurrentUserCalendar) //Змінити статус користувача, який підписаний на власний календар поточного користувача
router.get('/calendars/:calendarId/subscribe', checkTokenMiddleware, getAllUsersSubsedToCurrentCalendar);                 //Отримати усіх користувачів, які підписані на власний календар поточного користувача
router.get('/calendars/:calendarId/role', checkTokenMiddleware, getCurrentUserRoleInCurrentCalendar);                     //Отримати роль поточного користувача, який переглядає календар
router.delete('/calendars/:calendarId/subscribe/:userId', checkTokenMiddleware, unsubscribeUserToCurrentUserCalendar);    //Відписати користувача від власного календаря поточного користувача
router.patch('/calendars/:calendarId', checkTokenMiddleware, changeCalendarByCurrentUser);                                //Змінити дані власного календаря поточного користувача
router.delete('/calendars/:calendarId', checkTokenMiddleware, deleteCalendarByCurrentUser);                               //Видалити власний календар поточного користувача

module.exports = router;
