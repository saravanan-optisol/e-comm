import { NextFunction, Request, Response } from "express";
import jwt from 'jsonwebtoken';
import config  from '../config/config'

module.exports = (req: Request, res: Response, next: NextFunction) => {
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
    const decoded = jwt.verify(token, config.jwtSecret);
    //@ts-ignore
    req.user = decoded.user;
    next();
  } catch (err) {
    res.status(401).json({ msg: 'Token not valid' });
  }
};