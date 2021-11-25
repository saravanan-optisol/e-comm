import express from 'express';
const router = express.Router();
const {noValidator} = require('../middlewares/validator');
const jwtauth = require('../middlewares/jwtauth')
import order from '../controllers/order.controller'

// router.post('/addnew/:p_id', [jwtauth, acValidator()], cart.addNew);
router.post('/neworder', [jwtauth, noValidator()] , order.newOrder);
router.get('/getorders', jwtauth , order.getOrder);
router.get('/getordereditems/:o_id', jwtauth , order.getOrderedItems);
router.get('/trackorder/:o_id', order.trackOrder);
router.put('/updatetrack/:o_id', jwtauth , order.updateArrivalLocation);
router.delete('/cancel/:o_id', jwtauth , order.cancelOrder);

module.exports = router;