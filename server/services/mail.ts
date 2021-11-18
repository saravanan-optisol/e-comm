import sm from 'nodemailer'

const mail = {
    otpMail: (email: String, otp: Number)=>{
        const transport = sm.createTransport({
            service: 'gmail',
            auth: {
                user: 'verify.upi@gmail.com',
                pass: 'upipwd01'
            }
        })

        const msg: Object = {
            from : 'verify.upi@gmail.com',
            to: email,
            subject: 'your OTP for forgot password',
            html: `
                <h6>OTP is</h6>
                <p>${otp}</p>
            `
        }
        transport.sendMail(msg, (err)=>{
            if(err){
                console.log('err')
                throw err
            };

        })
    },
}

export default mail;