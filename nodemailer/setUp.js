const nodemailer = require("nodemailer");
// RESET PASSWORD NODEMAILER CONFIGURATION
const ResetPassword = (name, email, otp) => {
    try {
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: "talhahaider074@gmail.com",
                pass: "bwmcuysleqrlcemu",
            },
        });
        const mailOptions = {
            from: "talhahaider074@gmail.com",
            to: email,
            subject: "RESET PASSWORD EMAIL",
            html: `<p> Hi ${name} this is your reset password code ${otp}</p>`,
        };
        transporter.sendMail(mailOptions, function (err, info) {
        if (err) {
            console.log(err);
        } else {
            console.log("mail send", info.response);
        }
        });
    } 
    catch (error) {
      console.log(error);
    }
};

module.exports = {ResetPassword}