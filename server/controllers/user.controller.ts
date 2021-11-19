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

        //req params check
        const errors = resultValidator(req)
            if(errors.length > 0){
            return res.status(400).json({ 
                method: req.method,
                status: res.statusCode,
                error: errors
            });
        }
        const {username, email, password} = req.body;

        try {
            //check the username exists
            let checkusername = await User.findOne({
                where:{
                    username: username
                }
            })
            if(checkusername === null){
                return res.status(400).json({msg: 'username already exists'});
            }
            
            //check the email exists
            let checkemail = await User.findAll({
                where:{
                    email: email
                }
            })
            if(checkemail.length > 0){
                return res.status(400).json({msg: 'email already exists'});
            }
            
            //password encrytion 
            const salt = await bcrypt.genSalt(10);
            const pwd = await bcrypt.hash(password, salt);

            //user creation
             const user = await User.create({
                username: username,
                email: email,
                password: pwd
            })
            console.log(user);
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
                  res.status(201).json({ token });
                }
              ); 
        } catch (err) {
            console.log(err)
            res.status(500).json({msg: 'server error'});
        }
    },

    // @route GET user/get user   
    // @desc get the user profile
    // @access public
    getUser: async (req: Request, res: Response) =>{
        try {
            //check the user by token
            const user = await User.scope('withoutPassword').findAll({
              where:{
                  //@ts-ignore
                  user_id: req.user.user_id
              }
          });
          res.json(user);
        } catch (err) {
            console.log(err)
          res.status(500).send('server error');
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
            const Mail = await mail.otpMail(user.email, OTP)
            
            res.send(Mail);
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
                user = await User.scope('withoutPassword').findOne({ where: { username: credential },raw: true});
            }else{
                user = await User.scope('withoutPassword').findOne({ where: { email: credential },raw: true});
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
            res.status(500).json({msg: 'server err'});
        }

    }
}

export default user;