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
            const review = await reviewQuery.getReview(user_id, p_id);
            if(review){
                console.log(review)
                return failurehandler(res, req.method, 400, 'user already review this product')
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

      getAllProductReviews: async (req: Request, res: Response) =>{
          try {
              const product = await productQuery.findProduct(req.params.p_id);
              if(product === null){
                  return failurehandler(res, req.method, 400, 'product not found');
              }

              const reviews = await reviewQuery.getProductReviews(req.params.p_id);
              if(reviews.length <= 0){
                  return successhandler(res, req.method, 200, 'this product does not have any review yet')
              }

              successhandler(res, req.method, 200, reviews)
          } catch (err) {
            console.log(err);
            failurehandler(res, req.method, 500, 'server Error - ' + err)
          }
      },

      removeReview: async (req: Request, res: Response) =>{
        //@ts-ignore
        const {user_id} = req.user
        const {r_id} = req.params
          try {
            const user = await userQuery.findUser(user_id)
            if(user === null){
                return failurehandler(res, req.method, 401, 'unautherized user');
            }

            let review: any = await reviewQuery.getReviewById(r_id);
            if(review === null){
                return failurehandler(res, req.method, 400, 'review not found')
            }else if(review.user_id !== user_id){
                return failurehandler(res, req.method, 400, 'this review is not yours')
            }

            const reviewDelete = await reviewQuery.deleteReview(r_id)
            successhandler(res, req.method, 200, 'review Deleted')
          } catch (err) {
            console.log(err);
            failurehandler(res, req.method, 500, 'server Error - ' + err)
          }
      }
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