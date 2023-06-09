const multer = require('multer');

const imgConfiguration=multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null,'./postimage')
    },
    filename:(req,file,cb)=>{
        cb(null,`post-image-${Date.now()}-${file.originalname}`)
    }
})

const upload=multer({
    storage:imgConfiguration
})

module.exports = {upload}