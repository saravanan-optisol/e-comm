import jwt from 'jsonwebtoken'
import config from 'config'
import { NextFunction, Request, Response } from 'express';

export default  function (req: Request, res: Response, next: NextFunction) {
  //get token from header
  const token = req.header('x-auth-token');
  //check its token
  if (!token) {
    return res
      .status(401)
      .json({ msg: 'user not autherized' });
  }
  //verify the token
  try {
    const decoded: any = jwt.verify(token, config.get('jwtsecret'));
    
    // @ts-ignore
    req.user = decoded.user;
    next();
  } catch (err) {
    res.status(401).json({ msg: 'Token not valid' });
  }
};
