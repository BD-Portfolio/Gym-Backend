const Joi = require('joi');

validation = {}

// Method to validate the message added by admin for all users
validation.validateMessage = (values) =>{
    const schema = {
        title : Joi.string().min(1).required(),
        message : Joi.string().min(1).required()
    }
    return Joi.validate(values, schema);
}


// Method to validate the message added by admin for single users
validation.validateSingleUserMessage = (values) =>{
    const schema = {
        title : Joi.string().min(1).required(),
        message : Joi.string().min(1).required()
    }
    return Joi.validate(values, schema);
}


// Method to validate the message added by admin for mutiple users
validation.validateMultipleUserMessage = (values) =>{
    const schema = {
        title : Joi.string().min(1).required(),
        message : Joi.string().min(1).required(),
        user_id :Joi.array().min(1).required()
    }
    return Joi.validate(values, schema);
}


module.exports = validation;