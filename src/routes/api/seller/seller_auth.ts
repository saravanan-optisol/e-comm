import express, {Request, Response} from 'express'          
import auth from '../../../middleware/auth'
import {check, validationResult} from 'express-validator'
import config from 'config'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'      
import Seller from '../../../models/Seller'
const router = express.Router();   

// @route GET api/auth
router.get('/', auth, async (req: Request, res: Response) => {
  try {
      const seller = await Seller.findAll({
          where:{
              id: req.body.id 
          }
      })
    res.status(200).json(seller);      
  } catch (err: any) {
    res.status(500).send(err);   
  }     
});         
              
// @route POST api/auth
router.post('/', [
    check('email', 'email required').isEmail(),
    check('password', 'password required').not().isEmpty(),
], async(req: Request, res: Response) =>{

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      const { email, password } = req.body;

      try {
        let seller = await Seller.findAll({
            where:{
                email: req.body.email
            },
            raw : true
        })

        if (seller.length <= 0) {
        return res
            .status(400)
            .json({ errors: [{ msg: 'Invalid Credentials' }] });
        }

        const pwd = seller.map((seller :any) => {return seller.password})
        const isMatch = await bcrypt.compare(password, pwd.toString());
        if (!isMatch) {
          return res        
            .status(400)            
            .json({ errors: [{ msg: 'Invalid Credentials' }] });
        }

        const result = seller.map((seller :any)=> {return seller.id})
        const payload = {
            user: {
              id: result,
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
          res.status(500).send(err);
      }                       
})        
      
module.exports = router;