const joi = require('joi');


const registerValidation = (req,res,next)=>{
    let isValid = joi.object({}).keys({
        name:joi.string().required(),
        email:joi.string().email().required(),
        password:joi.string().required(),
        username:joi.string().required()
    })
    let {error} = isValid.validate(req.body,{abortEarly:false})
    if(error){
        res.status(401).json(error.message)
    }
    else{
        next()
    }
}

const loginValidation = (req,res,next)=>{
    let isValid = joi.object({}).keys({
        password:joi.string().required(),
        username:joi.string().required()
    })
    let {error} = isValid.validate(req.body,{abortEarly:false})
    if(error){
        res.status(401).json(error.message)
    }
    else{
        next()
    }
}


module.exports = {loginValidation,registerValidation}