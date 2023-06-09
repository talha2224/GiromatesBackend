const mongoose = require('mongoose');

const eventInterestedSchema = mongoose.Schema({
    eventId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Event"
    },
    requestedBy:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"userAccount"
    },
    accepted:{
        type:Boolean,
        default:null,
    },
    eventHolder:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"userAccount"
    }
},{timestamps:true})

const eventInterested = mongoose.model('eventInterested',eventInterestedSchema,'eventInterested')

module.exports = eventInterested 
