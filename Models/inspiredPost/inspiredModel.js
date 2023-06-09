const mongoose = require('mongoose');


const inspiredSchema = mongoose.Schema({
    postedBy:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'userAccount'
    },
    postImage:{type:Array,required:true},
    caption:{type:String,required:true},

    comments:[
        {
            commentBy:{type:mongoose.Schema.Types.ObjectId,ref:'userAccount'},
            comment:{type:String}
        }
    ],
    likes:[
        {type:mongoose.Schema.Types.ObjectId,ref:'userAccount'}
    ]
})


const inspiredPost = mongoose.model('inspiredPost',inspiredSchema,'inspiredPost')

module.exports = inspiredPost