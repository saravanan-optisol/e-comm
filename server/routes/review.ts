import express from 'express';
const router = express.Router();
const {reviewValidator} = require('../middlewares/validator');
const jwtauth = require('../middlewares/jwtauth')
import review from '../controllers/review.controller';

router.post('/addnew/:p_id', [jwtauth, reviewValidator()], review.newReview);

module.exports = router;