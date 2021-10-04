import express from 'express'
import db from '../../models/'
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
], async(req: any, res: any)=>{
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
  const { username, email, password } = req.body;

  try {
    let checkuser = await db.User.findAll({
        where: {
          email: req.body.email,
        },
      });
      if (checkuser.length > 0) {
        return res.json({msg: 'email already exists'});
      }

      const salt = await bcrypt.genSalt(10);
      const pwd = await bcrypt.hash(password, salt);
  
      const user = await db.User.create({
        username: username,
        email: email,
        password: pwd,
      });

      const payload = {
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
  } catch (err: any) {
    res.status(500).send("server error");
  }
})

module.exports = router;