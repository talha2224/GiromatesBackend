const mongoose = require('mongoose');

const registerSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    username:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    bio:{
        type:String,
        default:null
    },
    profileimage:{
        type:String,
        default:null
    },
    coverimage:{
        type:String,
        default:null

    },
    OTP:{
        type:Number,
        default:null
    },
    validTill:{type:Date,default:null},
    isVerified:{type:Boolean,default:false}

    
})

const userAccount = new mongoose.model('userAccount',registerSchema,'userAccount')

module.exports = userAccount
