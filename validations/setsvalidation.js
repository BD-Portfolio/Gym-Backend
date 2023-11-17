const Joi = require('joi');

validation = {}

// Method to validate the sets added by admin for exercise
validation.validateSets = (values) => {
    const schema = {
        data : Joi.array().min(1).required(),
        tpr : Joi.string().min(1).required()
    }
    return Joi.validate(values, schema);
}

// Method to check inner fields of sets are not empty
validation.validateAllSets = (data) => {
    for(i=0; i<data.length; i++){
        if( (data[i].sets == '' || data[i].sets == null) || (data[i].reps == '' || data[i].reps == null) || (data[i].reset == '' || data[i].reset == null) ){
            return false;
        }
    }
    return true;
}





module.exports = validation;