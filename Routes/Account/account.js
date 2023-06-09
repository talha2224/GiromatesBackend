const router = require('express').Router()
const { userAccountService } = require('../../Services')
const { catchAsync } = require('../../Error/Utils')
const { registerValidation, loginValidation } = require('../../Middlewares/Validation/account/accountValidation')
const {multiUpload} = require('../../Middlewares/Multer/userPhoto/profileandcover')
const { authorized } = require('../../Middlewares/Authentication/jwtAuthentication')


router.post('/register',registerValidation,catchAsync(async(req,res)=>{
    let {name,email,password,username} = req.body
    let userDetails = await userAccountService.registerUser(name,email,password,username)
    res.send(userDetails)
}))

router.post('/login',loginValidation,catchAsync(async(req,res)=>{
    let {password,username} = req.body
    let userDetails = await userAccountService.loginUser(password,username)
    res.send(userDetails)
}))

router.put('/update/:id',authorized,multiUpload.fields([{ name: 'profilePhoto', maxCount: 1 },{ name: 'coverPhoto', maxCount: 1 }]),catchAsync(async(req,res)=>{
    let {id} = req.params
    let {bio,username,name} = req.body
    let profilePhoto = req.files.profilePhoto && req.files.profilePhoto[0].filename;
    let coverPhoto = req.files.coverPhoto && req.files.coverPhoto[0].filename;
    let userDetails = await userAccountService.updateProfile(id,bio,username,name,profilePhoto,coverPhoto)
    res.send(userDetails)

}))

router.get('/single/:id',catchAsync(async(req,res)=>{
    let {id} = req.params
    let user = await userAccountService.getSingleUser(id)
    res.send(user)
}))

//FORGET PASSWORD
router.post("/forget/password",catchAsync(async (req, res) => {
      let { email } = req.body;
      let forgetPassword = await userAccountService.forgetPassword(email);
      res.send(forgetPassword);
    })
  );
  
  //OTP VERIFICATION
  router.post("/otp/verification",catchAsync(async (req, res) => {
      let { otp } = req.body;
      let resetPassword = await userAccountService.otpVerification(otp);
      res.send(resetPassword);
    })
  );
  
  //RESET PASSWORD
  router.post("/reset/password",catchAsync(async (req, res) => {
      let { email, password } = req.body;
      let resetPassword = await userAccountService.resetPassword(email, password);
      res.send(resetPassword);
    })
  );
module.exports= router
