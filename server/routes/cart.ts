import express from 'express';
const router = express.Router();
const {acValidator} = require('../middlewares/validator');
const jwtauth = require('../middlewares/jwtauth')
import cart from '../controllers/cart.controller'

router.post('/addnew/:p_id', [jwtauth, acValidator()], cart.addNew);
router.put('/update/:c_id/:p_id', [jwtauth, acValidator()], cart.updateCartProduct);

module.exports = router;