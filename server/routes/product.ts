import express from 'express';
const router = express.Router();
import auth from '../controllers/auth.controller';
import product from '../controllers/product.controller';
const {npValidator} = require('../middlewares/validator');
const jwtauth = require('../middlewares/jwtauth')

router.post('/new', [jwtauth, npValidator()], product.newProduct);
router.put('/updateproduct/:p_id', [jwtauth, npValidator()], product.updateProduct);
router.get('/getall', product.getAllProduct);   
router.get('/getall/seller', jwtauth, product.getAllProductBySeller);
router.get('/get/:p_id', product.getProductbyID);
router.get('/get/cat/:category', product.getAllProductByCategory);
router.get('/get/name/:name', product.getAllProductByName);
router.get('/delete/:p_id', jwtauth, product.getAllProductBySeller);

module.exports = router;