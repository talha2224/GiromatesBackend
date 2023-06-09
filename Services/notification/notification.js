const {NotificationModel } = require("../../Models");
const {ErrorResponse} = require('../../Error/Utils');


const upcomingEventNotification = async(id)=>{
    let findNotification = await NotificationModel.find({notificationFor:id,notificationType:"upcoming"}).populate('eventId','location daysRemaining coverImage category postedBy').populate('notificationFor','name username profileimage').sort({createdAt:-1})
    if (findNotification.length>0){
        return findNotification
    }
    else{
        throw new ErrorResponse("you have not any upcoming event notification",404)
    }
}

const requestedEventNotification = async(id)=>{
    let findNotification = await NotificationModel.find({notificationFor:id,notificationType:"pending"}).populate('eventId','location daysRemaining coverImage category postedBy').populate('notificationFor','name username profileimage').sort({createdAt:-1})
    if (findNotification.length>0){
        return findNotification
    }
    else{
        throw new ErrorResponse("you didnot sent any request to join event",404)
    }
}

const myEventNotification = async(id)=>{
    let findNotification = await NotificationModel.find({notificationFor:id,notificationType:"My event"}).populate('eventId','location daysRemaining coverImage category postedBy').populate('notificationBy','name username profileimage').sort({createdAt:-1})
    if (findNotification.length>0){
        return findNotification
    }
    else{
        throw new ErrorResponse("No one requested to join your event",404)
    }
}

const inspiredPostNotification = async(id)=>{
    let findNotification = await NotificationModel.find({notificationFor:id,notificationType:"inspired post"}).populate('postId','-likes -comments').populate('notificationBy','name username profileimage').sort({createdAt:-1})
    if (findNotification.length>0){
        return findNotification
    }
    else{
        throw new ErrorResponse("No one one like or comment on your post or no post posted",404)
    }   
}

module.exports = {upcomingEventNotification,requestedEventNotification,myEventNotification,inspiredPostNotification}