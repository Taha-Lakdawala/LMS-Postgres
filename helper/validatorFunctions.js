const Joi = require("joi")

exports.register = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().email().lowercase().required(),
    password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{5,30}$')).required(),
    password2: Joi.ref('password'),
});

exports.login = Joi.object({
    email: Joi.string().email().required().lowercase(),
    password: Joi.string().required()
});

exports.addBook = Joi.object({
    bname: Joi.string().required(),
    author: Joi.string().required(),
    isbn: Joi.string().required().min(10).max(13),
    quantity: Joi.number().min(1)
});

exports.removeBook = Joi.object({
    isbn: Joi.string().required().min(10).max(13),
    quantity: Joi.number().min(1)
});

exports.updateBook = Joi.object({
    isbn: Joi.string().required().min(10).max(13),
    bname: Joi.string(),
    author: Joi.string()
});

exports.findBook = Joi.object({
    isbn: Joi.string().required().min(10).max(13)
});

exports.updateUser = Joi.object({
    name: Joi.string(),
    email: Joi.string().email().lowercase(),
    password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{5,30}$')).required(),
    password2: Joi.ref('password'),
});