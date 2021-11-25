import express from 'express';
const router = express.Router();
const {reviewValidator} = require('../middlewares/validator');
const jwtauth = require('../middlewares/jwtauth')
import review from '../controllers/review.controller';

router.post('/addnew/:p_id', [jwtauth, reviewValidator()], review.newReview);
router.get('/getall/:p_id', review.getAllProductReviews)
router.delete('/remove/:r_id', jwtauth, review.getAllProductReviews)

module.exports = router;