import express, {Request, Response} from 'express'
import User from '../../../models/User'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import config from 'config'
import {check, validationResult} from 'express-validator'
const router = express.Router();

// @route POST user/new
router.post('/new',[
    check('username', 'username is required').not().isEmpty(), 
    check('email', 'please enter valid email').isEmail(),
    check('password', 'password is required').isLength({ min: 6 }),
], async(req: Request, res: Response)=>{

  const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    } 
  const { username, email, password } = req.body;
  console.log(config.get('test'));
  try {
    let checkuser = await User.findAll({
        where: {
          email: req.body.email,
        },
      });

      if (checkuser.length > 0) {
        return res.json({msg: 'email already exists'});
      }

      const salt = await bcrypt.genSalt(10);
      const pwd = await bcrypt.hash(password, salt);
  
       const user = await User.create({
        username: username,
        email: email,
        password: pwd,
      }); 

      const payload: object = {
        user: {
          id: user.id,
        },
      };

      jwt.sign(payload, config.get('jwtsecret'),
        { expiresIn: 360000 }, 
        (err: any, token:any) => {
        if (err) throw err;
        res.status(200).json({ token }); 
      });
  } catch (err: unknown) {
    console.log(err)
    res.status(500).send("server error");
  }
})

module.exports = router;