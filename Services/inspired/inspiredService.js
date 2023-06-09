const { inspiredPostModel, NotificationModel, AccountModel } = require("../../Models");
const {ErrorResponse} = require('../../Error/Utils');

const createPost = async(postedBy,caption,postImage)=>{
    let createPost = await inspiredPostModel.create({postedBy:postedBy,caption:caption,postImage:postImage})
    if(createPost){
        return createPost
    }
    else{
        throw new ErrorResponse("Failed to create post",404)
    }
}

const getAllPost = async(id)=>{
    let allPost = await inspiredPostModel.find({}).populate('postedBy', 'name username profileimage').populate('comments.commentBy', 'name username profileimage').populate('likes', 'name username profileimage')
    console.log(allPost)
    if (allPost.length > 0) {
        const modifiedResponse = allPost.map(single => {
          const likedByUser = single.likes.some(like => like._id.toString() === id);
          return {...single.toObject(),like: likedByUser};
        });
        return modifiedResponse;
    } 
    else{
        throw new ErrorResponse('no post found',404)
    }
}

const getSinglePost = async(postId,userId)=>{
    let allPost = await inspiredPostModel.findById(postId).populate('postedBy', 'name username profileimage').populate('comments.commentBy', 'name username profileimage').populate('likes', 'name username profileimage')
    if (allPost){
        const islIked = allPost.likes.some(like=>like._id.toString()===userId)
        return {...allPost.toObject(),like:islIked}
    }
    else{
        throw new ErrorResponse('no post found',404)
    }
}

const getPostByUser = async(id)=>{
    let allPost = await inspiredPostModel.find({postedBy:id}).populate('postedBy', 'name username profileimage').populate('comments.commentBy', 'name username profileimage').populate('likes', 'name username profileimage')
    if (allPost.length > 0) {
        const modifiedResponse = allPost.map(single => {
          const likedByUser = single.likes.some(like => like._id.toString() === id);
          return {...single.toObject(),like: likedByUser};
        });
        return modifiedResponse;
    } 
    else{
        throw new ErrorResponse('no post found',404)
    }
}

// LIKE AND UNLIKE POST
const likePost = async(postid,userId)=>{
    let findEvent = await inspiredPostModel.findById(postid)
    let findUser = await AccountModel.findById(userId)
    if (findEvent){
        if (findEvent.likes.includes(userId)) {
            findEvent.likes.pull(userId);
            let deleteNotification = await NotificationModel.findOneAndDelete({postId:postid,notificationBy:userId,notificationType:"inspired post"})
        } 
        else {
            // postedBy
            findEvent.likes.push(userId);
            let createNotification = await NotificationModel.create({notificationFor:findEvent.postedBy,notificationType:"inspired post",message:`${findUser.name} has like your post`,postId:postid,notificationBy:userId})
        }
        const updatePost = await findEvent.save();
        return updatePost
    }
    else{
        throw new ErrorResponse('No post found to like ',404)
    }
}

// COMMENT
const comment = async(postId,userId,comment)=>{
    let findEvent = await inspiredPostModel.findById(postId)  
    let findUser = await AccountModel.findById(userId)
    if(!findEvent){
        throw new ErrorResponse('wrong event id no such event found',404)
    }
    else{
        let updatePost = await inspiredPostModel.findByIdAndUpdate(postId,{$push:{comments:{commentBy:userId,comment:comment}}},{new:true})
        if (updatePost){
            let createNotification = await NotificationModel.create({notificationFor:findEvent.postedBy,notificationType:"inspired post",message:`${findUser.name} has commented your post`,postId:postId,notificationBy:userId})
            return updatePost
        }
    } 
    return updatePost
}


module.exports = {createPost,getAllPost,getSinglePost,getPostByUser,likePost,comment}