import express, {Request, Response} from 'express'
import User from '../models/user.model'
import bcrypt from 'bcryptjs'
import  jwt  from 'jsonwebtoken'
import config  from '../config/config'
const {resultValidator} = require('../middlewares/validator')

let auth: any = {
  login : async (req: Request, res:Response) =>{
    const errors = resultValidator(req)
    if(errors.length > 0){
        return res.status(400).json({ 
        method: req.method,
        status: res.statusCode,
        error: errors
        })
    }
    const {credential, password} = req.body;
    
    let user;
    if(credential.indexOf('@') === -1){
        user = await User.findOne({ where: { username: credential },raw: true});
    }else{
        user = await User.findOne({ where: { email: credential },raw: true});
    }

    if(user === null){
        return res.status(400).json({msg: 'username of email not exists'});
    }

    // const pwd = user.map((user: any) => {return user.password})
    const pwd = user.password
    const isMatch = await bcrypt.compare(password, pwd.toString());
      if (!isMatch) {
        return res
          .status(400)
          .json({ errors: [{ msg: 'Invalid Credentials1' }] });
      }

    // const result = user.map((user: any) =>{return user.user_id})
    const result= user.user_id
    const payload = {
      user: {
          //@ts-ignore
        user_id: result,
      },
    };

    jwt.sign(
      payload,
      config.jwtSecret,
      { expiresIn: 360000 },
      (err, token) => {
        if (err) throw err;
        res.json({ token });
      }
    ); 
  }
}

export default auth;