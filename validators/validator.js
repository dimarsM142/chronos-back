const Joi = require('joi');

function userValidation(data) {
    const schema = Joi.object({
        login: Joi.string().min(4).max(29).required(),
        psw: Joi.string().min(6).max(29).required(),
        repeatpsw: Joi.string().min(6).max(29),
        fname: Joi.string().min(8).max(64).required(),
        email: Joi.string().min(4).max(255).email().required()
    });

    return schema.validate(data);
}

function changeValidation(data) {
    const schema = Joi.object({
        login: Joi.string().min(4).max(29).required(),
        fname: Joi.string().min(8).max(64).required(),
        email: Joi.string().min(4).max(255).email().required()
    });

    return schema.validate(data);
}

function loginValidation(data) {
    const schema = Joi.object({
        login: Joi.string().min(1).max(29).required(),
        psw: Joi.string().min(1).max(29).required()
    });

    return schema.validate(data);
}

function pswResValidation(data) {
    const schema = Joi.object({
        login: Joi.string().min(1).max(29).required()
    })

    return schema.validate(data);
}

function confPswResValidation(data) {
    const schema = Joi.object({
        newpsw: Joi.string().min(6).max(29).required(),
        repeatnewpsw: Joi.string().min(6).max(29).required(),
        login: Joi.string().required()
    });

    return schema.validate(data);
}

function calendarCreateValidation(data) {
    const schema = Joi.object({
        title: Joi.string().min(6).max(29).required(),
        description: Joi.string().min(6).required()
    });

    return schema.validate(data);
}

function calendarChangeValidation(data) {
    const schema = Joi.object({
        title: Joi.string().min(6).max(29),
        description: Joi.string().min(6)
    });

    return schema.validate(data);
}

function calendarSubscribeValidation(data) {
    const schema = Joi.object({
        userLogin: Joi.string().min(4).max(29).required(),
        role: Joi.string().valid('admin', 'user').required()
    });

    return schema.validate(data);
}

function calendarChangeSubscribedValidation(data) {
    const schema = Joi.object({
        role: Joi.string().valid('admin', 'user').required()
    });

    return schema.validate(data);
}

function eventCreateValidation(data) {
    const schema = Joi.object({
        title: Joi.string().min(6).max(29).required(),
        description: Joi.string().min(6).required(),
        executionDate: Joi.string().min(("2022-04-22 10:34:23").length).max(("2022-04-22 10:34:23").length + 4).example("2022-04-22 10:34:23").required(),
        type: Joi.string().valid('arrangement', 'reminder', 'task').required(),
        duration: Joi.number().min(5*60).max(12*60*60)
    })

    return schema.validate(data);
}

function eventChangeValidation(data) {
    const schema = Joi.object({
        title: Joi.string().min(6).max(29),
        description: Joi.string().min(6),
        executionDate: Joi.string().length(("2022-04-22 10:34:23.55").length).example("2022-04-22 10:34:23.55"),
        type: Joi.string().valid('arrangement', 'reminder', 'task'),
        duration: Joi.number().min(5*60).max(12*60*60)
    })

    return schema.validate(data);
}

module.exports = {
    userValidation,
    changeValidation,
    loginValidation,
    pswResValidation,
    confPswResValidation,
    calendarCreateValidation,
    calendarChangeValidation,
    calendarSubscribeValidation,
    calendarChangeSubscribedValidation,
    eventCreateValidation,
    eventChangeValidation
}
