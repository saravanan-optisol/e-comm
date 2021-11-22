import express, {Request, Response} from 'express'
import User from '../models/user.model'
import bcrypt from 'bcryptjs'
import  jwt  from 'jsonwebtoken'
import config  from '../config/config'
const {resultValidator} = require('../middlewares/validator');
import mail from '../services/mail'
import db from '../config/dbconnection'

let user: any = {
    // @route POST user/register    
    // @desc Register User
    // @access public
    createUser: async (req: Request, res: Response) =>{
        console.log('req from client')
        console.log(req.body)
        //req params check
        const errors = resultValidator(req)
            if(errors.length > 0){
                return failurehandler(res, req.method, 400, errors);
        }
        const {username, email, password, role_id} = req.body;

        try {
            if(role_id === 0){
                failurehandler(res, req.method, 401, 'you cannot create this type account')
            }
            //check the username exists
            let checkusername = await User.findAll({ where:{ username: username }})
            if(checkusername.length > 0){
                return failurehandler(res, req.method, 400, 'username already exists');
            }
            
            //check the email exists
            let checkemail = await User.findAll({ where:{ email: email }})
            if(checkemail.length > 0){
                return failurehandler(res, req.method, 400, 'email already exists');
            }
            
            //password encrytion 
            const salt = await bcrypt.genSalt(10);
            const pwd = await bcrypt.hash(password, salt);

            //user creation
             const user = await User.create({
                username,
                email,
                password: pwd,
                role_id
            })
            const payload: Object = {
                user: {
                    user_id: user.user_id
                }
            }

            //generate the jwt Token for payload
            jwt.sign(
                payload,
                config.jwtSecret,
                { expiresIn: 360000 },
                (err, token) => {
                  if (err) throw err;
                  successhandler(res, req.method, 201, token)
                }
              ); 
        } catch (err) {
            console.log(err);
            failurehandler(res, req.method, 500, 'server Error - ' + err)
        }
    },

    // @route GET user/get user   
    // @desc get the user profile
    // @access public
    getUser: async (req: Request, res: Response) =>{
        try {
            //check the user by token
            //@ts-ignore
            const user = await User.scope('withoutPassword').findByPk(req.user.user_id);
          res.json(user);
        } catch (err) {
            console.log(err);
            failurehandler(res, req.method, 500, 'server Error - ' + err)
        }
      },
    
    // @route PUT user/update profile    
    // @desc Update User
    // @access public
    updateProfile: async (req: Request, res: Response) =>{
        try {
            //check the user exists'
        //@ts-ignore
        const user = await User.scope('withoutPassword').findByPk(req.user.user_id);

        if(user === null){
            return res.status(400).json({msg: 'usern not exists'});
        }

        const {username, email, address, mobile, } = req.body;
        let updateData = {
            username,
            address,
            mobile,
            email
        }
        if (username) updateData.username = username;
        if (email) updateData.email = email;
        if (mobile) updateData.mobile = mobile;
        if (address) updateData.address = address;

        console.log(updateData);
        await User.update(updateData, {
            where:{
                //@ts-ignore
                user_id: req.user.user_id
            }
        })

        res.status(201).json({msg: 'updated'})
        } catch (err) {
            console.log(err);
            failurehandler(res, req.method, 500, 'server Error - ' + err)
        }
    },

    // @route GET user/all    
    // @desc get all user
    // @access private
    getAllUser: async(req: Request, res: Response)=>{
        try {
            //@ts-ignore
            let user: any = await User.findByPk(req.user.user_id)

            if(user === null){
                return res.status(400).json({msg: 'user not exists'})
            }else if(user.role_id !== 0){
                return res.status(401).json({msg: 'user not allow for this task'})
            }

            user = await User.scope('withoutPassword').findAll();
            successhandler(res, req.method, 200, user)
        } catch (err) {
            console.log(err);
            failurehandler(res, req.method, 500, 'server Error - ' + err)
        }
    },
    
    // @route POST user/forgot password    
    // @desc Forgot password
    // @access public
    forgotPassword: async(req: Request, res: Response) =>{
        //req params check
        const errors = resultValidator(req)
        if(errors.length > 0){
            return res.status(400).json({ 
                method: req.method,
                status: res.statusCode,
                error: errors
            });
        }
        const {credential} = req.body;

        //check the credentials is username or email
        let user: any;
        if(credential.indexOf('@') === -1){
            user = await User.scope('withoutPassword').findOne({ where: { username: credential },raw: true});
        }else{
            user = await User.scope('withoutPassword').findOne({ where: { email: credential },raw: true});
        }

        //if user not exists
        if(user === null){
            return res.status(400).json({msg: 'username of email not exists'}); 
        }

        //generate the OTP
        const uid =  user.user_id;
        let OTP =  Math.floor(Math.random() * (9999 - 1111 + 1) ) + 1111;

        //Update the OTP to database
        user = await User.update({otp: OTP}, {where: {user_id: uid}}).then(async () =>{
            //invoke the email service
            console.log(user.email)
            const Mail = await mail.otpMail(user.email, OTP)
            
            res.status(200).json({msg: 'otp sent to your registered email'});
        })
        .catch((err) =>{res.send('cha' + err)});
            
    },

    // @route POST user/reset password    
    // @desc Reset password
    // @access public
    resetPassword: async (req: Request, res: Response) =>{
        //req params check
        const errors = resultValidator(req)
        if(errors.length > 0){
            return res.status(400).json({ 
                method: req.method,
                status: res.statusCode,
                error: errors
            });
        }   

        const {credential, otp, newpassword} = req.body;
        let user;
        
        try {
            //check the credentials
            if(credential.indexOf('@') === -1){
                user = await User.scope('getOTP').findOne({ where: { username: credential },raw: true});
            }else{
                user = await User.scope('getOTP').findOne({ where: { email: credential },raw: true});
            }

            //check the user exists
            if(user === null){
                return res.status(400).json({msg: 'username of email not exists'}); 
            }
            const dbOTP = user.otp;
            
            //check the user make a forgot password request or not
            if(dbOTP === null){
                return res.status(400).json({msg: 'bad request'});
            }
            const uid: any = user.user_id

            //encrypt the password
            const salt = await bcrypt.genSalt(10);
            const pwd = await bcrypt.hash(newpassword, salt);

            //check the otp is correct or not
            if(dbOTP === otp){
                 await User.update({password: pwd}, {where: {user_id: uid}});
                 await User.update({otp: null}, {where: {user_id: uid}})

                return res.status(201).json({msg: 'password changed'});
            }

            //remove the otp from database
            await User.update({otp: null}, {where: {user_id: uid}})
            res.status(400).json({msg: 'otp not correct'});
        } catch (err) {
            console.log(err);
            failurehandler(res, req.method, 500, 'server Error - ' + err)
        }

    },
}


let successhandler = (res: Response, method: String, statusCode: any, data: any) =>{
    console.log('success')
    res.status(statusCode).json({ 
        method: method,
        status: "success",
        statusCode: statusCode,
        payload: data
    })
}

let failurehandler = (res: Response, method: String, statusCode: any, data: any) =>{
    console.log('failure')
    res.status(statusCode).json({ 
        method: method,
        status: "failed",
        statusCode: statusCode,
        msg: data
    })
}

export default user;