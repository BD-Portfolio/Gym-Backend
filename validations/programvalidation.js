const Joi = require('joi');

validation = {}

// Method to validate the new program to be added by the admin
validation.validateCreateExercise = (values) =>{
    const schema = {
        name : Joi.string().min(1).required(),
        exercise_ids : Joi.array().min(1).required()
    }
    return Joi.validate(values, schema);
}



module.exports = validation;



