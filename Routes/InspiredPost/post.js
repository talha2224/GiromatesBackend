const router = require('express').Router()
const { catchAsync } = require('../../Error/Utils')
const { authorized } = require('../../Middlewares/Authentication/jwtAuthentication')
const { upload } = require('../../Middlewares/Multer/inspiredPost/setup')
const { getInspiredService } = require('../../Services')

// CREATE POST 
router.post('/create',authorized,upload.array('postImage',10),catchAsync(async(req,res)=>{
    let postImage = req?.files?.map(file => file.filename);
    let {postedBy,caption} = req.body
    let create = await getInspiredService.createPost(postedBy,caption,postImage)
    res.send(create)
}))

// GET ALL POST 
router.get('/all/:id',catchAsync(async(req,res)=>{
    let {id} = req.params
    let allPost = await getInspiredService.getAllPost(id)
    res.send(allPost)
}))

// GET SINGLE POST 
router.get('/:postId/userId/:userId',catchAsync(async(req,res)=>{
    let {postId,userId} = req.params
    let allPost = await getInspiredService.getSinglePost(postId,userId)
    res.send(allPost)
}))

// GET POST BY USER
router.get('/user/:id',catchAsync(async(req,res)=>{
    let {id} = req.params
    let allPost = await getInspiredService.getPostByUser(id)
    res.send(allPost)
}))


//LIKE UNLIKE 
router.put('/like/:postid',authorized,catchAsync(async(req,res)=>{
    let {postid} = req.params
    let {userId} = req.body
    let update = await getInspiredService.likePost(postid,userId)
    res.send(update)
}))

//Comment
router.put('/comment/:postid',authorized,catchAsync(async(req,res)=>{
    let {postid} = req.params
    let {userId,comment} = req.body
    let update = await getInspiredService.comment(postid,userId,comment)
    res.send(update)
}))


module.exports = router