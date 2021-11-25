import express from 'express';
const router = express.Router();
const {acValidator} = require('../middlewares/validator');
const jwtauth = require('../middlewares/jwtauth')
import cart from '../controllers/cart.controller'

// router.post('/addnew/:p_id', [jwtauth, acValidator()], cart.addNew);
router.post('/addnew/:p_id', jwtauth, cart.addNew);
router.put('/update/:reqtype/:c_id/:p_id', jwtauth, cart.updateCartProduct);
router.post('/delete/:c_id/:p_id', jwtauth, cart.addNew);

module.exports = router;