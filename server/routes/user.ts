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
router.post('/forgotpassword', fpValidator(), user.forgotPassword);
router.post('/resetpassword', rpValidator(), user.resetPassword);

module.exports = router;