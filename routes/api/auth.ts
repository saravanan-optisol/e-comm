import express from 'express'
import auth from '../../middleware/auth'
import {check, validationResult} from 'express-validator'
import config from 'config'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import db from '../../models'
const router = express.Router();

// @route GET api/auth
router.get('/', auth, async (req: any, res: any) => {
  try {
      const user = await db.User.findAll({
          where:{
              id: req.user.id 
          }
      })
    res.status(200).json(user);
  } catch (err: any) {
      console.log(err)
    res.status(500).send('server error');
  }
});

// @route POST api/auth
router.post('/', [
    check('username', 'username required'),
    check('password', 'password required')
], async(req: any, res: any) =>{
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      const { email, password } = req.body;

      try {
        let user = await db.User.findAll({
            where:{
                email: req.body.email
            }
        })

        if (user.length <= 0) {
        return res
            .status(400)
            .json({ errors: [{ msg: 'Invalid Credentials' }] });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
          return res
            .status(400)
            .json({ errors: [{ msg: 'Invalid Credentials' }] });
        }

        const payload = {
            user: {
              id: user.id,
            },
          };
    
          jwt.sign(
            payload,
            config.get('jwtsecret'),
            { expiresIn: 360000 },
            (err, token) => {
              if (err) throw err;
              res.status(200).json({ token });
            }
          );
      } catch (err) {
          res.status(500).json({errors: 'Server error'})
      }
})

module.exports = router;
