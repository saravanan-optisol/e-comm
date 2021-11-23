import express, {Request, Response} from 'express'
import userQuery from '../dao/user.query'
import reviewQuery from '../dao/review.query'
import productQuery from '../dao/product.query'
const {resultValidator} = require('../middlewares/validator')

let review: any = {
// @route POST product/newproduct    
    // @desc Upload new Product
    // @access public
   
    newReview : async (req: Request, res:Response) =>{

        //req params check
        const errors = resultValidator(req)
        if(errors.length > 0){
            return failurehandler(res, req.method, 400, errors);
        }
        //@ts-ignore
        const {user_id} = req.user
        const {rating, comment} = req.body;
        const {p_id} = req.params
        try {
            const user = await userQuery.findUser(user_id)
            if(user === null){
                return failurehandler(res, req.method, 401, 'unautherized user');
            }

            const product = await productQuery.findProduct(p_id);
            if(product === null){
                return failurehandler(res, req.method, 400, 'product not found')
            }

            //@ts-ignore
            const review = await reviewQuery.getUserReview(user_id);
            if(review.length > 0){
                review.forEach((review: any) => {
                    console.log(review.product_id);
                    if(review.product_id == p_id){
                        console.log('if')
                        return failurehandler(res, req.method, 400, 'user already review this product');
                    }
                })
            }
            console.log('after')
            const reviewData = {user_id, product_id: p_id, comment, rating}
            const addreview = await reviewQuery.addReview(reviewData); 
            successhandler(res, req.method, 201, 'review added')
        } catch (err) {
            console.log(err);
            failurehandler(res, req.method, 500, 'server Error - ' + err)
        }
      },
}
let successhandler = (res: Response, method: String, statusCode: any, data: any) =>{
    console.log('success')
    res.status(statusCode).json({ 
        method: method,
        status: "success",
        statusCode: statusCode,
        payload: data
    })
}

let failurehandler = (res: Response, method: String, statusCode: any, data: any) =>{
    console.log('failure')
    res.status(statusCode).json({ 
        method: method,
        status: "failed",
        statusCode: statusCode,
        msg: data
    })
}

export default review;