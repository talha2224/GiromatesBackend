const multer = require("multer");

const combinedStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    if (file.fieldname === 'profilePhoto') {
        cb(null, './userImage');
    } 
    else if (file.fieldname === 'coverPhoto') {
        cb(null, './coverImage');
    } 
    else {
      cb(new Error('Invalid fieldname'));
    }
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() +file.originalname);
  }
});

const multiUpload = multer({
  storage:combinedStorage
}) 

module.exports = {multiUpload}