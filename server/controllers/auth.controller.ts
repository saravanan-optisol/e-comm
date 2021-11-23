import express, {Request, Response} from 'express'
import User from '../models/user.model'
import bcrypt from 'bcryptjs'
import  jwt  from 'jsonwebtoken'
import config  from '../config/config'
const {resultValidator} = require('../middlewares/validator')
import userQuery from '../dao/user.query'

let auth: any = {

  // @route POST auth/login 
  // @desc User Login
  // @access public
  login : async (req: Request, res:Response) =>{

    //req params check
    const errors = resultValidator(req)
    if(errors.length > 0){
      return failurehandler(res, req.method, 400, errors);
    }
    const {credential, password} = req.body;
    
    try {
      //check the credential is username or email
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

    //password validation
    // const pwd = user.map((user: any) => {return user.password})
    const pwd = user.password
    const isMatch = await bcrypt.compare(password, pwd.toString());
      if (!isMatch) {
        return failurehandler(res, req.method, 400, 'invalid credentials')
      }

    //create a payload for jwt
    // const result = user.map((user: any) =>{return user.user_id})
    const result= user.user_id
    const payload = {
      user: {
          //@ts-ignore
        user_id: result,
      },
    };

    //jwt token generation
    jwt.sign(
      payload,
      config.jwtSecret,
      { expiresIn: 360000 },
      (err, token) => {
        if (err) throw err;
        successhandler(res, req.method, 200, token)
      }
    ); 
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

export default auth;