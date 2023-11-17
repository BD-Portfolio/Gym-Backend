const Joi = require('joi');

validation = {}

// Method to validate the exercise details added by the admin
validation.validateExercise = (values) =>{
    const schema = {
        name : Joi.string().min(1).required(),
        description : Joi.string().min(1).required(),
        ppr : Joi.string().min(1).required(),
        pps : Joi.string().min(1).required(),
        image : Joi.empty(),
        imagepath : Joi.empty(),
        video : Joi.empty(),
        videopath : Joi.empty()
    }
    return Joi.validate(values, schema);
}


// Method to validate the exercise details updated by the admin
validation.validateExerciseUpdate = (values) =>{
    const schema = {
        name : Joi.string().min(1).required(),
        description : Joi.string().min(1).required(),
        ppr : Joi.string().min(1).required(),
        pps : Joi.string().min(1).required(),
    }
    return Joi.validate(values, schema);
}


module.exports = validation;