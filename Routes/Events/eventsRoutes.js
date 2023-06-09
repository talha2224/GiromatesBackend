const router = require('express').Router()
const { catchAsync } = require('../../Error/Utils')
const { uploadeventImage } = require('../../Middlewares/Multer/eventImage/setup')
const { eventService } = require('../../Services')
const {authorized} =require('../../Middlewares/Authentication/jwtAuthentication')


// EVENT POST
router.post('/post',authorized,uploadeventImage.single('cover'),catchAsync(async(req,res)=>{
    let {postedBy,category,slots,longitude,latitude,day,month,year,hours,minutes,Am} =req.body

    const location = {
        longitude:longitude,
        latitude:latitude
    }
    const time={
        hours:hours,
        minutes:minutes,
        Am:Am
    }
    const timeRemaning = {
        hours:hours,
        minutes:minutes,
    }
    const days = {
        day:day,
        month:month,
        year:year
    }
    const daysRemaining = {
        day:day,
        month:month,
        year:year
    }
    let cover= req?.file?.filename
    let eventPosted = await eventService.postEvent(postedBy,cover,category,slots,location,time,timeRemaning,days,daysRemaining)
    res.send(eventPosted)
}))


//LIKE UNLIKE 
router.put('/like/:eventId',authorized,catchAsync(async(req,res)=>{
    let {eventId} = req.params
    let {userId} = req.body
    let update = await eventService.likePost(eventId,userId)
    res.send(update)
}))

//Comment
router.put('/comment/:eventId',authorized,catchAsync(async(req,res)=>{
    let {eventId} = req.params
    let {userId,comment} = req.body
    let update = await eventService.comment(eventId,userId,comment)
    res.send(update)
}))

//GET ALL BY USER ID 
router.get('/all/:id',authorized,catchAsync(async(req,res)=>{
    let {id} = req.params
    let update = await eventService.getAll(id)
    res.send(update)
}))

// GET EVENT FOR EACH USER
router.get('/user/:id',authorized,catchAsync(async(req,res)=>{
    let {id} = req.params
    let update = await eventService.getByUserId(id)
    res.send(update)
}))

// GET SINGLE EVENT 
router.get('/:eventId/userId/:userId',catchAsync(async(req,res)=>{
    let {eventId,userId} = req.params
    let allPost = await eventService.getSingleEvent(eventId,userId)
    res.send(allPost)
}))

// POST EVENT JOIN REQUEST
router.put('/request/:eventId',authorized,catchAsync(async(req,res)=>{
    let {eventId} = req.params
    let {requestedBy} = req.body
    let update = await eventService.requestEvent(eventId,requestedBy)
    res.send(update)
}))

// REQUEST DECLINED
router.put('/request/delete/:eventId',authorized,catchAsync(async(req,res)=>{
    let {eventId} = req.params
    let {requestedBy} = req.body
    let update = await eventService.declineRequest(eventId,requestedBy)
    res.send(update)
}))

//REQUEST ACCEPTED
router.put('/request/accept/:eventId',authorized,catchAsync(async(req,res)=>{
    let {eventId} = req.params
    let {requestedBy} = req.body
    let update = await eventService.acceptRequest(eventId,requestedBy)
    res.send(update)
}))


module.exports = router