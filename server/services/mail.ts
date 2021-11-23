import sm from 'nodemailer'
import config from '../config/config'

const mail = {
    otpMail: async (email: String, otp: Number)=>{
        const transport = sm.createTransport({
            service: 'gmail',
            auth: {
                user: config.mailid,
                pass: config.mailpwd
            }
        })

        const msg: Object = {
            from : config.mailid,
            to: email,
            subject: 'your OTP for forgot password',
            html: `
                <h6>OTP is</h6>
                <p>${otp}</p>
            `
        }
        await transport.sendMail(msg);
    },
}

export default mail;