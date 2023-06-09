const mongoose = require('mongoose');

const notificationSchema = mongoose.Schema({

    message:{
        type:String,
        required:true
    },
    notificationFor:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"userAccount"
    },
    notificationBy:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"userAccount"
    },
    notificationType:{
        type:String,
        required:true
    },
    eventId:{
        type:mongoose.Schema.Types.ObjectId , ref:"Event"
    },
    postId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"inspiredPost"
    }
    
},{timestamps:true})

const Notification = mongoose.model("Notification",notificationSchema,"Notification")

module.exports = Notification