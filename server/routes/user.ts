const { registerValidator, fpValidator, rpValidator, daValidator } = require('../middlewares/validator');
const jwtauth = require('../middlewares/jwtauth')

import express from 'express';
const router = express.Router();
import user from '../controllers/user.controller';

router.post('/register',registerValidator(), user.createUser);
router.get('/getuser', jwtauth, user.getUser);
router.put('/forgotpassword', fpValidator(), user.forgotPassword);
router.put('/resetpassword', rpValidator(), user.resetPassword);
router.put('/updateprofile', [jwtauth, registerValidator()], user.updateProfile);
router.get('/all', jwtauth, user.getAllUser);
router.delete('/delete', [jwtauth, daValidator()], user.deleteAccount)

module.exports = router;