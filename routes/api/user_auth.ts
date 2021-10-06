import express from 'express'          
import auth from '../../middleware/u_auth'
import {check, validationResult} from 'express-validator'
import config from 'config'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'      
import db from '../../models'
const router = express.Router();   

// @route GET api/auth
router.get('/', auth, async (req: any, res: any) => {
  console.log('get user_auth')
  try {
      const user = await db.User.findAll({
          where:{
              id: req.user.id 
          }
      })
      console.log(user)
    res.status(200).json(user);      
  } catch (err: any) {        
           console.log('serve err ' + err)      
    res.status(500).send('server error');   
  }     
});         
              
// @route POST api/auth
router.post('/', [
    check('email', 'email required').isEmail(),
    check('password', 'password required').not().isEmpty(),
], async(req: any, res: any) =>{
  console.log('user auth')
    const errors = validationResult(req);
    console.log(errors)
    if (!errors.isEmpty()) {
      console.log('if error')
        return res.status(400).json({ errors: errors.array() });
      }
      const { email, password } = req.body;

      try {
        console.log('try')
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

        const isMatch = await bcrypt.compare(password, '$2b$10$9qY3t2l1ZQJp/KKfewt1xeyyT7CQzHWTCp2sc7XYTdGdUPLwzeTSO');
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
        console.log('serve err ' + err)
          res.status(500).json({errors: 'Server error'})
      }
})

module.exports = router;