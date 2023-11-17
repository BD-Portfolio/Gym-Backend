const Joi = require('joi');

validation = {}

// Method to validate the note added by the admin
validation.validateNote = (values) =>{
    const schema = {
        status : Joi.string().min(7).required(),
        note : Joi.string().min(1).required()
    }
    return Joi.validate(values, schema);
}



module.exports = validation;