const mongoose  = require('mongoose');

const eventSchema = new mongoose.Schema({
    postedBy:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"userAccount"
    },

    coverImage:{
        type:String,
        required:true
    },

    category:{
        type:String,
        required:true
    },

    slots:{
        type:Number,
        required:true
    },

    slotRemaining:{
        type:Number,
        default:0
    },

    location:{
        longitude:{type:String,required:true},
        latitude:{type:String,required:true}
    },

    days:{
        day:{type:Number,required:true},
        month:{type:Number,required:true},
        year:{type:Number,required:true}
    },

    daysRemaining:{
        day:{type:Number},
        month:{type:Number},
        year:{type:Number}
    },

    time:{
        hours:{type:Number,required:true},
        minutes:{type:Number,required:true},
        Am:{type:String,required:true}
    },
    
    timeRemaning:{
        hours:{type:Number},
        minutes:{type:Number}
    },

    comments: [
        {
            user: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'userAccount',
            },
            commentText: {
                type: String,
            }
        }
    ],

    likes: [
        {type: mongoose.Schema.Types.ObjectId,ref: 'userAccount'}
    ],

    alreadyMembers: [
        {type: mongoose.Schema.Types.ObjectId,ref: 'userAccount'}
    ],

    joinRequest:[
        {type: mongoose.Schema.Types.ObjectId,ref: 'userAccount'}
    ],
    active:{
        type:Boolean,
        default:true
    }
},{timestamps:true})

const Event = mongoose.model('Event',eventSchema,'Event')
// ENUM 
module.exports= Event