import express, {Request, Response} from 'express'
import User from '../models/user.model'
import Product from '../models/product.model'
import bcrypt from 'bcryptjs'
import  jwt  from 'jsonwebtoken'
import config  from '../config/config'
import Review from '../models/review.model'
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
        const {rating, comment} = req.body;
        try {
            //@ts-ignore
            const user = await User.findByPk(req.user.user_id);
            console.log(user);
            if(user === null){
                return failurehandler(res, req.method, 400, 'unautherized user')
            }

            const product = await Product.findByPk(req.params.p_id);  
            if(product === null){
                return failurehandler(res, req.method, 400, 'Product not found')
            }

            const review = await Review.create({
                //@ts-ignore
                user_id: req.user.user_id,
                //@ts-ignore
                product_id: req.params.p_id,
                comment: comment,
                rating: rating
            })
        
            successhandler(res, req.method, 201, review)
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