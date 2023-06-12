const { AccountModel } = require("../../Models");
const { ErrorResponse } = require("../../Error/Utils");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { ResetPassword } = require("../../nodemailer/setUp");

const registerUser = async (name, email, password, username) => {
  let userNameFound = await AccountModel.findOne({ username: username });
  if (userNameFound) {
    throw new ErrorResponse("Username Already Taken", 409);
  } 
  else {
    let hash = await bcrypt.hashSync(password, 10);
    let registeredUser = await AccountModel.create({
      name: name,
      email: email,
      password: hash,
      username: username,
    });
    if (registeredUser) {
      let token = jwt.sign({ registeredUser }, process.env.SECRETKEY);
      if (token) {
        const {OTP,validTill,isVerified,...userInfo} = registeredUser._doc
        return { userInfo, token };
      }
    }
  }
};

const loginUser = async (password, username) => {
  let userAccount = await AccountModel.findOne({ username: username });
  if (!userAccount) {
    throw new ErrorResponse("No account registered for this username", 404);
  } 
  else {
    let comparePassword = await bcrypt.compare(password, userAccount.password);
    if (!comparePassword) {
      throw new ErrorResponse("Invalid Credentials", 403);
    } 
    else {
      let token = jwt.sign({ userAccount }, process.env.SECRETKEY);
      if (token) {
        const {OTP,validTill,isVerified,...userInfo} = userAccount._doc
        return { userInfo, token };
      }
    }
  }
};

const updateProfile = async (id,bio,username,name,profilePhoto,coverPhoto) => {
  let findProfile = await AccountModel.findByIdAndUpdate(id,{$set: {
    name: name,username: username,bio: bio,profileimage: profilePhoto,coverimage: coverPhoto
  }},{ new: true });

  if (findProfile) {
    return findProfile;
  } 
  else {
    throw new ErrorResponse(
      "wrong user account id given failed to update",
      404
    );
  }
};

const getSingleUser = async (id) => {
  let findUser = await AccountModel.findById(id);
  if (findUser) {
    return findUser;
  } else {
    throw new ErrorResponse("No User Found Wrong Id", 404);
  }
};

// FORGET PASSWORD

const forgetPassword = async (email) => {
  let findUser = await AccountModel.findOne({ email: email });

  if (!findUser) {
    throw new ErrorResponse("wrong email. Email not found", 404);
  }
  let randomString = Math.floor(Math.random() * 9000) + 1000;
  let Updated = await AccountModel.findOneAndUpdate(
    { email: email },
    {
      $set: {
        OTP: randomString,
        validTill: new Date(new Date().setMinutes(new Date().getMinutes() + 5)),
      },
    },
    { new: true }
  );
  if (Updated) {
    ResetPassword(findUser.name, email, Updated.OTP);
    return { msg: "OTP SENT TO YOUR ACCOUNT", otp: Updated.OTP };
  }
};

const otpVerification = async (otp) => {
  let findUser = await AccountModel.findOne({ OTP: otp });
  if (!findUser) {
    throw new ErrorResponse("wrong otp given", 404);
  } else if (findUser.validTill > Date.now()) {
    let updateVerify = await AccountModel.findOneAndUpdate(
      { OTP: otp },
      { $set: { isVerified: true } }
    );
    if (updateVerify) {
      let deleteOtp = await AccountModel.findOneAndUpdate(
        { OTP: otp },
        { $set: { OTP: null, validTill: null } }
      );
      return { msg: "OTP VERIFIED", sucess: true };
    } else {
      return { msg: "OTP NOT VERIFIED", sucess: false, status: 500 };
    }
  }
  let deleteOtp = await AccountModel.findOneAndUpdate(
    { OTP: otp },
    { $set: { OTP: null, validTill: null } }
  );
  throw new ErrorResponse(
    "otp timeout please again call forget password api",
    408
  );
};

//RESET PASSWORD
const resetPassword = async (email, password) => {
  let findUser = await AccountModel.findOne({ email: email });
  if (findUser) {
    if (findUser.isVerified === true) {
      let hash = await bcrypt.hash(password, 10);
      let updatePassword = await AccountModel.findOneAndUpdate(
        { email: email },
        { $set: { password: hash, isVerified: false } },
        { new: true }
      );
      if (updatePassword) {
        return { msg: "password updated sucesfully sucesfully" };
      }
    } else {
      throw new ErrorResponse("otp not verified please verified first", 500);
    }
  } else {
    throw new ErrorResponse("invalid Email", 404);
  }
};
module.exports = {
  registerUser,
  loginUser,
  updateProfile,
  getSingleUser,
  forgetPassword,
  otpVerification,
  resetPassword,
};
