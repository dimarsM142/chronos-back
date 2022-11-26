const express = require('express');
const checkTokenMiddleware = require('../../middleware/auth');
const { getAllEventsFromCurrentCalendar,
        createEventInCurrentCalendar,
        changeEventInCurrentCalendar,
        getCurrentEventInfo,
        deleteEventFromCurrentCalendar } = require('../../controllers/event-controller');

const router = express.Router();

router.get('/calendars/:calendarId/events', checkTokenMiddleware, getAllEventsFromCurrentCalendar);                   //Отримати всі івенти з поточного календаря
router.post('/calendars/:calendarId/events', checkTokenMiddleware, createEventInCurrentCalendar);                     //Створити івент в поточному календарі
router.patch('/calendars/:calendarId/events/:eventId', checkTokenMiddleware, changeEventInCurrentCalendar);           //Змінити дані івенту в поточному календарі
router.get('/events/:eventId', checkTokenMiddleware, getCurrentEventInfo);                                            //Отримати інформацію щодо поточного івенту
router.delete('/calendars/:calendarId/events/:eventId', checkTokenMiddleware, deleteEventFromCurrentCalendar);        //Видалити івент з поточного календаря

module.exports = router;
