const otpGen = require('otp-generator');

exports.createOTP = () =>{
    let OTP = otpGen.generate(6, { digits: true, alphabets: false, upperCase: false, specialChars: false })
    return OTP;
}