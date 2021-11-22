const { registerValidator, fpValidator, rpValidator } = require('../middlewares/validator');
const jwtauth = require('../middlewares/jwtauth')

import express from 'express';
const router = express.Router();
import user from '../controllers/user.controller';


/**
 * @swagger
 * /register:
 *  post:
 *    description: Use to request all customers
 *    responses:
 *      '200':
 *        description: A successful response
 */
router.post('/register',registerValidator(), user.createUser);
router.get('/getuser', jwtauth, user.getUser);
router.put('/forgotpassword', fpValidator(), user.forgotPassword);
router.put('/resetpassword', rpValidator(), user.resetPassword);
router.put('/updateprofile', jwtauth, user.updateProfile);
router.get('/all', jwtauth, user.getAllUser);

module.exports = router;