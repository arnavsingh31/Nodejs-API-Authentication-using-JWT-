const Joi = require('@hapi/joi');

//Register validation
const registerValidation = (data)=>{
    const schema = Joi.object({
        name: Joi.string().min(6).required(),
        email: Joi.string().required().email(),
        password: Joi.string().required().min(6).max(20)
    });
    return schema.validate(data, {abortEarly: false})
}


//login validation
const loginValidation = (data)=>{
    const schema = Joi.object({
        
        email: Joi.string().required().email(),
        password: Joi.string().required().min(6).max(20)
    });
    return schema.validate(data, {abortEarly: false})
}

module.exports = {
    registerValidation,
    loginValidation
}
