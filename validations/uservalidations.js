const Joi = require('joi');

validation = {}

// Method to validate fields during registration of user byadmin
validation.validateUserRegistration = (values) =>{
    const schema = {
        first_name : Joi.string().min(1).required(),
        last_name : Joi.string().min(1).required(),
        gender : Joi.string().min(4).required(),
        dob : Joi.string().min(10).max(10).required(),
        address : Joi.string().required(),
        mobile : Joi.string().min(10).required(),
        zip_code : Joi.string().required(),
        phone : Joi.empty(),
        country : Joi.string().min(2).required(),
        email : Joi.string().min(11).required(),
        image : Joi.empty(),
        filepath : Joi.empty()
    }
    return Joi.validate(values, schema);
}
    
// Method to validate status while updating status of user
validation.validateStatusOfUser = (values) =>{
    const schema = {
        activated : Joi.number().required()
    }
    return Joi.validate(values, schema);
}



module.exports = validation;