const router = require('express').Router()
const { catchAsync } = require('../../Error/Utils')
const {notificationService} = require('../../Services')
const {authorized} = require('../../Middlewares/Authentication/jwtAuthentication')

// UPCOMING EVENT
router.get('/upcoming/:id',authorized,catchAsync(async(req,res)=>{
    let {id} = req.params
    let upcoming = await notificationService.upcomingEventNotification(id)
    res.send(upcoming)
}))

// REQUESTED EVENT
router.get('/requested/:id',authorized,catchAsync(async(req,res)=>{
    let {id} = req.params
    let requested = await notificationService.requestedEventNotification(id)
    res.send(requested)
}))

// MY  EVENT
router.get('/myevent/:id',authorized,catchAsync(async(req,res)=>{
    let {id} = req.params
    let myevent = await notificationService.myEventNotification(id)
    res.send(myevent)
}))

router.get('/inspired/post/:id',authorized,catchAsync(async(req,res)=>{
    let {id} = req.params
    let myevent = await notificationService.inspiredPostNotification(id)
    res.send(myevent)
}))


module.exports = router