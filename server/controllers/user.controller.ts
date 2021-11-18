import express, {Request, Response} from 'express'
import User from '../models/user.model'
import bcrypt from 'bcryptjs'
import  jwt  from 'jsonwebtoken'
import config  from '../config/config'
const {resultValidator} = require('../middlewares/validator');
import mail from '../services/mail'
import db from '../config/dbconnection'

// @route POST user/register    
// @desc Register User
// @access public
let user: any = {
    createUser: async (req: Request, res: Response) =>{
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
            let checkusername = await User.findOne({
                where:{
                    username: username
                }
            })
            if(checkusername === null){
                return res.status(400).json({msg: 'username already exists'});
            }
            
            let checkemail = await User.findAll({
                where:{
                    email: email
                }
            })
            if(checkemail.length > 0){
                return res.status(400).json({msg: 'email already exists'});
            }
            
            const salt = await bcrypt.genSalt(10);
            const pwd = await bcrypt.hash(password, salt);

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

    getUser: async (req: Request, res: Response) =>{
        try {
            //@ts-ignore
            console.log(req.user.user_id)
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
    
    forgotPassword: async(req: Request, res: Response) =>{
        const errors = resultValidator(req)
        if(errors.length > 0){
            return res.status(400).json({ 
                method: req.method,
                status: res.statusCode,
                error: errors
            });
        }
        const {credential} = req.body;

        let user;
        if(credential.indexOf('@') === -1){
            user = await User.scope('withoutPassword').findOne({ where: { username: credential },raw: true});
        }else{
            user = await User.scope('withoutPassword').findOne({ where: { email: credential },raw: true});
        }

        if(user === null){
            return res.status(400).json({msg: 'username of email not exists'}); 
        }

        const uid =  user.user_id;
        let OTP =  Math.floor(Math.random() * (9999 - 1111 + 1) ) + 1111;
        console.log(OTP);

        user = await User.update({otp: OTP}, {where: {user_id: uid}}).then(async () =>{
            const Mail = await mail.otpMail('saravanan.bsk3@gmail.com', OTP)
            
            res.send(Mail);
        })
        .catch((err) =>{res.send('cha' + err)});
            
    },

    resetPassword: async (req: Request, res: Response) =>{
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
            if(credential.indexOf('@') === -1){
                user = await User.scope('withoutPassword').findOne({ where: { username: credential },raw: true});
            }else{
                user = await User.scope('withoutPassword').findOne({ where: { email: credential },raw: true});
            }
    
            if(user === null){
                return res.status(400).json({msg: 'username of email not exists'}); 
            }

            console.log(user.otp);
            console.log(newpassword);
    
            const dbOTP = user.otp;
            if(dbOTP === null){
                return res.status(400).json({msg: 'bad request'});
            }
            console.log(typeof dbOTP, dbOTP)
            console.log(typeof otp, otp)
            const uid: any = user.user_id

            const salt = await bcrypt.genSalt(10);
            const pwd = await bcrypt.hash(newpassword, salt);

            if(dbOTP === otp){
                 await User.update({password: pwd}, {where: {user_id: uid}});
                 await User.update({otp: null}, {where: {user_id: uid}})

                return res.status(201).json({msg: 'password changed'});
            }

            await User.update({otp: null}, {where: {user_id: uid}})
            res.status(400).json({msg: 'otp not correct'});
        } catch (err) {
            console.log(err);
            res.status(500).json({msg: 'server err'});
        }

    }
}

export default user;