const Joi = require('joi');

validation = {}

// Method to validate fields during registration of admin
validation.validateAdminRegistration = (values) =>{
    const schema = {
        first_name : Joi.string().min(1).required(),
        last_name : Joi.string().min(1).required(),
        email : Joi.string().min(11).required(),
        phone : Joi.string().required(),
        bio : Joi.string().empty(),
        password : Joi.string().min(8).required()
    }
    return Joi.validate(values, schema);
}


// Method to validate email and password during login
validation.validateAdminLogin = (values) => {
    const schema = {
        email : Joi.string().min(11).required(),
        password : Joi.string().min(8).required()
    }
    return Joi.validate( values, schema);
}


// Method to validate fields during updation of admin details
validation.validateAdminDetailsUpdate = (values) =>{
    const schema = {
        first_name : Joi.string().empty(),
        last_name : Joi.string().min(1).required(),
        email : Joi.string().min(11).required(),
        phone : Joi.string().required(),
        bio : Joi.string().empty()
    }
    return Joi.validate(values, schema);
}



// Method to validate fields to change the password of admin
validation.validatePasswordChange = (values) =>{
    const schema = {
        old_password : Joi.string().min(8).required(),
        new_password : Joi.string().min(8).required(),
        confirm_password : Joi.string().min(8).required()
    }
    return Joi.validate(values, schema);
}


module.exports = validation;