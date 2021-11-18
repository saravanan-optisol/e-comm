import { Request } from "express"
import  {check, validationResult} from 'express-validator'

exports.resultValidator = (req: Request) =>{
    const messages = []
    if(!validationResult(req).isEmpty()){
        const errors = validationResult(req).array()
        for(const i of errors){
            messages.push(i)
        }
    }
    return messages;
}

exports.registerValidator = () =>{
    return[
        check('username', 'username is required').not().isEmpty(),
        check('email', 'email is required').isEmail(),
        check('password', 'enter valid password').isLength({min: 6})
    ]
}

exports.loginValidator = () =>{
    return[
        check('credential', 'username or email is required').not().isEmpty(),
        check('password', 'enter valid password').isLength({min: 6})
    ]
}

exports.fpValidator = () =>{
    return[
        check('credential', 'username or email is required').not().isEmpty(),
    ]
}

exports.rpValidator = () =>{
    return[
        check('credential', 'credential is required').not().isEmpty(),
        check('newpassword', 'new password is required').isLength({min: 6}),
        check('otp', 'enter the otp').isLength({min: 4})
    ]
}
