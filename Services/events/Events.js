const { EventModel,EventInterestedModel, NotificationModel, AccountModel } = require("../../Models");
const {ErrorResponse} = require('../../Error/Utils');


const postEvent = async(postedBy,cover,category,slots,location,time,timeRemaning,days,daysRemaining)=>{

    let createEvent = await EventModel.create({postedBy:postedBy,coverImage:cover,category:category,slots:slots,slotRemaining:slots,
    location:location,time:time,timeRemaning:timeRemaning,days:days,daysRemaining:daysRemaining})

    if (createEvent){
        let createNotification= await NotificationModel.create({
            eventId:createEvent._id,message:`You have an upcoming ${category} event on ${days.day}/${days.month}/${days.year}`,notificationFor:postedBy,notificationType:"upcoming"
        })
        if (createNotification){
            return createEvent
        }
    }
    else{
        throw new ErrorResponse('Event Not Created',400)
    }
}

// LIKE AND UNLIKE EVENT
const likePost = async(eventId,userId)=>{
    let findEvent = await EventModel.findById(eventId)
    if (findEvent){
        if (findEvent.likes.includes(userId)) {
            findEvent.likes.pull(userId);
        } 
        else {
            findEvent.likes.push(userId);
        }
        const updatedEvent = await findEvent.save();
        return updatedEvent
    }
    else{
        throw new ErrorResponse('No event found ',404)
    }
}

// COMMENT
const comment = async(eventId,userId,comment)=>{
    let findEvent = await EventModel.findById(eventId)  
    if(!findEvent){
        throw new ErrorResponse('wrong event id no such event found',404)
    }
    else{
        let createComment = await EventModel.findByIdAndUpdate(eventId,{$push:{comments:{user:userId,commentText:comment}}},{new:true})
        if (createComment){
            return createComment
        }
    } 
    return updatedEvent
}

const getAll = async (id) =>   {
    const getAll = await EventModel.find({}).populate('postedBy', 'name username profileimage').populate('likes', 'name username profileimage').populate('comments.user', 'name username profileimage').sort({createdAt:-1})
    if (getAll.length > 0) {
      const modifiedResponse = getAll.map(event => {
        const requested= event.joinRequest.includes(id)
        const going = event.alreadyMembers.includes(id)
        const likedByUser = event.likes.some(like => like._id.toString() === id);
        return {
          ...event.toObject(),
          like: likedByUser,
          alreadyRequested:requested,
          alreadyGoing:going,
        };
      });
      return modifiedResponse;
    } 
    else {
      throw new ErrorResponse("No Event Found", 404);
    }
};

const getByUserId = async(id)=>{
    const getAll = await EventModel.find({postedBy:id}).populate('postedBy', 'name username profileimage').populate('likes', 'name username profileimage').populate('comments.user', 'name username profileimage')
    if (getAll.length > 0) {
      const modifiedResponse = getAll.map(event => {
        const likedByUser = event.likes.some(like => like._id.toString() === id);
        return {
          ...event.toObject(),
          like: likedByUser,
        };
      });
      return modifiedResponse;
    } 
    else {
      throw new ErrorResponse("You didnot post any event", 404);
    }
}

const getSingleEvent = async(eventId,userId)=>{
    const getSingle = await EventModel.findById(eventId).populate('postedBy', 'name username profileimage').populate('likes', 'name username profileimage').populate('comments.user', 'name username profileimage')
    if (getSingle){
        // postId,userId
        const islIked = getSingle.likes.some(like=>like._id.toString()===userId)
        return {...getSingle.toObject(),like:islIked}
    }
    else{
        throw new ErrorResponse('no event found wrong id',404)
    }
}

// Request Event
const requestEvent = async(eventId,requestedBy)=>{

    let AlreadyRequestSent = await EventInterestedModel.findOne({eventId:eventId,requestedBy:requestedBy})
    let findEvent = await EventModel.findById(eventId)
    let findUser = await AccountModel.findById(requestedBy)
    if (AlreadyRequestSent){
        throw new ErrorResponse("You already send request",403)
    }

    else{
        let updateEvent = await EventModel.findByIdAndUpdate(eventId,{$push:{
            joinRequest:requestedBy
        }})
        let postinterested = await EventInterestedModel.create({eventId:eventId,requestedBy:requestedBy,eventHolder:findEvent.postedBy})
        if (postinterested && updateEvent){

            let pendingRequestNotification = await NotificationModel.create({
                eventId:eventId,message:`Pending request for an event: ${findEvent.category}`,notificationFor:requestedBy,notificationType:"pending"
            })
            let myEventsNotification = await NotificationModel.create({
                eventId:eventId,message:`${findUser.name} has requested to join your event:${findEvent.category}`,notificationFor:findEvent.postedBy,notificationType:"My event",notificationBy:requestedBy
            })

            if (pendingRequestNotification && myEventsNotification){
                return {msg:"Request sent",sucess:true}
            }
        }
        else{
            return {msg:"Request not sent",sucess:false}
        }
    }
}

// REQUEST DECLINE
const declineRequest = async(eventId,requestedBy)=>{
    let sendRequest = await EventInterestedModel.findOne({eventId:eventId,requestedBy:requestedBy})
    if (!sendRequest){
        throw new ErrorResponse("You didnot send request",403)
    }
    else{
        let updateEvent = await EventModel.findByIdAndUpdate(eventId,{$pull:{
            joinRequest:requestedBy
        }})
        let deletePendingNotification= await NotificationModel.findOneAndDelete({eventId:eventId,notificationFor:requestedBy,notificationType:"pending"})
        let deleteMyEventNotification = await NotificationModel.findOneAndDelete({eventId:eventId,notificationFor:updateEvent.postedBy,notificationType:"My event"})
        let declineRequest = await EventInterestedModel.findOneAndUpdate({eventId:eventId},{$set:{accepted:false}})
        if (updateEvent && declineRequest && deletePendingNotification && deleteMyEventNotification){
            return {msg:"Request deleted",sucess:true}
        }
        else{
            return {msg:"Request not deleted",sucess:false}
        }
    }
}

// REQUEST ACCEPTED
const acceptRequest = async(eventId,requestedBy)=>{
    let findRequest = await EventInterestedModel.findOne({eventId:eventId,requestedBy:requestedBy})
    let findEvent = await EventModel.findById(eventId)
    if (!findRequest || !findEvent){
        throw new ErrorResponse("You didnot send request or no such event exits failed to accept",403)
    }
    else if (findRequest.accepted===true){
        throw new ErrorResponse("already request accepted",405)
    }
    else{
        if (findEvent.slotRemaining>=0){
            let updateEvent = await EventModel.findByIdAndUpdate(eventId,
                {
                    $push:{alreadyMembers:requestedBy},
                    $set:{slotRemaining:findEvent.slotRemaining-1},
                    $pull:{joinRequest:requestedBy}
                },{new:true})
            let updateInvitation = await EventInterestedModel.findOneAndUpdate({eventId:eventId,requestedBy:requestedBy},{$set:{
                accepted:true
            }})
            if (updateEvent && updateInvitation){
                let changePendingToUpcoming = await NotificationModel.findOneAndUpdate({eventId:eventId,notificationFor:requestedBy,notificationType:"pending"},{$set:{
                    notificationType:"upcoming",
                    message:`You have an upcoming event:${findEvent.category} event on ${findEvent.days.day}/${findEvent.days.month}/${findEvent.days.year}`
                }})
                let deleteMyEventNotification = await NotificationModel.findOneAndDelete({eventId:eventId,notificationFor:findEvent.postedBy,notificationBy:requestedBy,notificationType:"My event"})

                if (changePendingToUpcoming,deleteMyEventNotification){
                    return {msg:`REQUEST ACCEPTED SLOTS LEFT ${updateEvent.slotRemaining} `,sucess:true}
                }
            }
        }
        else{
            throw new ErrorResponse("failed to accept more request slots are full ",403)
        }
    }
}

// GET EVENT FOR EACH USER
const getEvent = async(id)=>{
    const userEvent = await EventModel.find({postedBy:id})
    if (userEvent.length>0){
        return userEvent
    }
    else{
        throw new ErrorResponse("you have not posted any event please add some",404)
    }
}  
module.exports = {postEvent,getAll,likePost,comment,requestEvent,declineRequest,acceptRequest,getEvent,getSingleEvent,getByUserId}