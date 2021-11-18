import express from 'express';
const router = express.Router();
import auth from '../controllers/auth.controller';
const {loginValidator} = require('../middlewares/validator');

router.post('/login', loginValidator(), auth.login);

module.exports = router;