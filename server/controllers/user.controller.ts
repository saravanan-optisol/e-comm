import express, {Request, Response} from 'express'
import User from '../models/user.model'
import bcrypt from 'bcryptjs'
import  jwt  from 'jsonwebtoken'
import config  from '../config/config'
const {resultValidator} = require('../middlewares/validator');
import mail from '../services/mail'
import db from '../config/dbconnection'
import userQuery from '../dao/user.query'

let user: any = {
    // @route POST user/register    
    // @desc Register User
    // @access public
    createUser: async (req: Request, res: Response) =>{

        //req params check
        const errors = resultValidator(req)
            if(errors.length > 0){
                return failurehandler(res, req.method, 400, errors);
        }
        const {username, email, password, role_id} = req.body;

        try {
            //check role_id is admin role
            if( role_id === 0){
                return failurehandler(res, req.method, 401, 'you cannot create this type account')
            }

            //check the username exists
            let usercheck = await userQuery.checkUsernameExist(username);
            if(usercheck){
                return failurehandler(res, req.method, 400, usercheck)
            }

            //check the email exists
            let emailcheck = await userQuery.checkEmailExist(email);
            if(emailcheck){
                return failurehandler(res, req.method, 400, emailcheck)
            }
            
            //password encrytion 
            const salt = await bcrypt.genSalt(10);
            const pwd = await bcrypt.hash(password, salt);

            //user creation
            const user = await userQuery.createUser(username, email, pwd, role_id);
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
            const user = await userQuery.findUser(req.user.user_id)
            if(user === null){
                return failurehandler(res, req.method, 400, 'user not found')
            }

            successhandler(res, req.method, 200, user);
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
            console.log('update')
            //check the user exists'
        //@ts-ignore
        const user = await userQuery.findUser(req.user.user_id)
            if(user === null){
                return failurehandler(res, req.method, 400, 'user not found')
            }

            console.log(user)

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

        //@ts-ignore
        await userQuery.updateUserProfile(req.user.user_id, updateData)
        console.log('after')

        return successhandler(res, req.method, 201, 'Profile Updated');
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
            let user: any = userQuery.findUser(req.user.user_id);

            if(user === null){
                return failurehandler(res, req.method, 401, 'unautherized request')
            }else if(user.role_id !== 0){
                return failurehandler(res, req.method, 401, 'forbinated')
            }

            let allUser = await userQuery.getAllUser();
            if(allUser.length <= 0){
                return successhandler(res, req.method, 200, 'user not exists')
            }
            successhandler(res, req.method, 200, allUser)
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
                return failurehandler(res, req.method, 400, errors);
        }
        const {credential} = req.body;

        //check the credentials is username or email
        try {
            let user: any;
            if(credential.indexOf('@') === -1){
                user = await userQuery.findByUsername(credential)
            }else{
                user = await userQuery.findByEmail(credential)
            }

            //if user not exists
            if(user === null){
                return failurehandler(res, req.method, 400, 'username or email not found')
            }

            //generate the OTP
            const uid =  user.user_id;
            let OTP =  Math.floor(Math.random() * (9999 - 1111 + 1) ) + 1111;

            //Update the OTP to database
            const otpupdate = await userQuery.updateOTP(OTP, uid);
            const Mail = await mail.otpMail(user.email, OTP)
            
            successhandler(res, req.method, 200, 'mail sent to your registered mail id')
        } catch (err) {
            console.log(err);
            failurehandler(res, req.method, 500, 'server Error - ' + err)
        }
            
    },

    // @route POST user/reset password    
    // @desc Reset password
    // @access public
    resetPassword: async (req: Request, res: Response) =>{
        //req params check
        const errors = resultValidator(req)
            if(errors.length > 0){
                return failurehandler(res, req.method, 400, errors);
        }
        const {credential, otp, newpassword} = req.body;
    
        try {
            let user: any;
            if(credential.indexOf('@') === -1){
                user = await userQuery.findByUsername(credential)
            }else{
                user = await userQuery.findByEmail(credential)
            }

            //if user not exists
            if(user === null){
                return failurehandler(res, req.method, 400, 'username or email not found')
            }
            const dbOTP = user.otp;
            
            //check the user make a forgot password request or not
            if(dbOTP === null){
                return failurehandler(res, req.method, 400, 'bad request')
            }   
            const uid= user.user_id

            //encrypt the password
            const salt = await bcrypt.genSalt(10);
            const pwd = await bcrypt.hash(newpassword, salt);

            //check the otp is correct or not
            if(dbOTP === otp){
                await userQuery.updatePassword(pwd, uid);
                await userQuery.resetOTP(uid);
                return successhandler(res, req.method, 200, 'password updated')        
            }

            //remove the otp from database
            await userQuery.resetOTP(uid);
            failurehandler(res, req.method, 400, 'otp not correct')
        } catch (err) {
            console.log(err);
            failurehandler(res, req.method, 500, 'server Error - ' + err)
        }

    },

    deleteAccount: async (req: Request, res: Response) =>{
        //@ts-ignore
        const {user_id} = req.user
        const {password} = req.body
        try {
            let user = await userQuery.findUserWithPwd(user_id)
            if(user === null){
                return failurehandler(res, req.method, 401, 'unautherized user');
            }

            const pwd = user.password;
            const isMatch = await bcrypt.compare(password, pwd.toString());
            if (!isMatch) {
              return failurehandler(res, req.method, 400, 'invalid credentials')
            }

            const deleteAcc = await userQuery.deleteAccount(user_id);
            successhandler(res, req.method, 200, 'Account Deleted')
        } catch (err) {
            console.log(err);
            failurehandler(res, req.method, 500, 'server Error - ' + err)
        }
    }
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