import { Request } from "express"
import  {check, validationResult} from 'express-validator'

// validate the every routes
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

// Register Validator
exports.registerValidator = () =>{
    return[
        check('username', 'username is required').not().isEmpty(),
        check('email', 'email is required').isEmail(),
        check('password', 'enter valid password').isLength({min: 6}),
        check('role_id', 'role_id is required').not().isEmpty(),
    ]
}

// Login Validator
exports.loginValidator = () =>{
    return[
        check('credential', 'username or email is required').not().isEmpty(),
        check('password', 'enter valid password').isLength({min: 6})
    ]
}

// Forgot password Validator
exports.fpValidator = () =>{
    return[
        check('credential', 'username or email is required').not().isEmpty(),
    ]
}

// Reset Password validator
exports.rpValidator = () =>{
    return[
        check('credential', 'credential is required').not().isEmpty(),
        check('newpassword', 'new password is required').isLength({min: 6}),
        check('otp', 'enter the otp').isLength({min: 4})
    ]
}

// Create Product validator
exports.npValidator = () =>{
    return[
        check('product_name', 'product name is required').not().isEmpty(),
        check('title', 'title is required').not().isEmpty(),
        check('no_of_items', 'no_of_Products is required').not().isEmpty(),
        check('description', 'description is required').not().isEmpty(),
        check('prize', 'prize is required').not().isEmpty(),
        check('category', 'category is required').not().isEmpty(),
        check('imgsrc', 'img is required').not().isEmpty(),
        check('brand', 'brand is required').not().isEmpty(),
    ]
}

// Add new item to the cart Validator
exports.acValidator = () =>{
    return[
        check('quantity', 'quantity is required').not().isEmpty(),
    ]
}