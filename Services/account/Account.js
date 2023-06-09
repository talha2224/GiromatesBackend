const { AccountModel } = require("../../Models");
const {ErrorResponse} = require('../../Error/Utils');
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const registerUser = async(name,email,password,username)=>{
    let userNameFound = await AccountModel.findOne({username:username})
    if(userNameFound){
        throw new ErrorResponse('Username Already Taken',409)
    }
    else{
        let hash = await bcrypt.hashSync(password,10)
        let registeredUser = await AccountModel.create({name:name,email:email,password:hash,username:username})
        if(registerUser){
            let token = jwt.sign({registerUser},process.env.SECRETKEY)
            if(token){
                return {registeredUser,token}
            }
        }
    }
}

const loginUser = async(password,username)=>{
    let userAccount = await AccountModel.findOne({username:username})
    if(!userAccount){
        throw new ErrorResponse('No account registered for this username',404)
    }
    else{
        let comparePassword = await bcrypt.compare(password,userAccount.password)
        if(!comparePassword){        
            throw new ErrorResponse('Invalid Credentials',403)
        }
        else{
            let token = jwt.sign({userAccount},process.env.SECRETKEY)
            if(token){
                return {userAccount,token}
            }
        }
    }
}

const updateProfile = async (id,bio,username,name,profilePhoto,coverPhoto)=>{
    let findProfile = await AccountModel.findByIdAndUpdate(id,{$set:{
        name:name,
        username:username,
        bio:bio,
        profileimage:profilePhoto,
        coverimage:coverPhoto
    }},{new:true})
    if (findProfile){
        return findProfile
    }
    else{
        throw new ErrorResponse("wrong user account id given failed to update",404)
    }
}

const getSingleUser = async(id)=>{
    let findUser = await AccountModel.findById(id)
    if (findUser){
        return findUser
    }
    else{
        throw new ErrorResponse("No User Found Wrong Id",404)
    }
}
module.exports = {registerUser,loginUser,updateProfile,getSingleUser}