import express, {Request, Response} from 'express'
import User from '../models/user.model'
import Cart from '../models/cart.model'
import Product from '../models/product.model'
const {resultValidator} = require('../middlewares/validator')

let cart: any = {
  addNew : async (req: Request, res:Response) =>{
    //req params check
    const errors = resultValidator(req)
    if(errors.length > 0){
        return failurehandler(res, req.method, 400, errors);
}
    const {p_id}: any = req.params
    try {
        //@ts-ignore
        let user = await User.findByPk(req.user.user_id);
        if(user === null){
            return failurehandler(res, req.method, 401, 'unautherized request');
        }
        let product = await Product.findByPk(p_id);
        if(product === null){
            return failurehandler(res, req.method, 400, 'product not found')
        }else if(product.no_of_items <= 0){
            return failurehandler(res, req.method, 400, 'currentlly unavailable')
        }else if(product.no_of_items < req.body.quantity){
            return failurehandler(res, req.method, 400, `only ${product.no_of_items} stocks available`);
        }

        const cart = await Cart.create({
            //@ts-ignore
            user_id: req.user.user_id,
            product_id: p_id,
            quantity: req.body.quantity
        })
    
        await Product.update({ 
            no_of_items: product.no_of_items - req.body.quantity
        },{
            where: {
                product_id: p_id
            }
        })
        successhandler(res, req.method, 201, 'Product added to your cart');
    } catch (err) {
        console.log(err);
        failurehandler(res, req.method, 500, 'server Error - ' + err)
    }
  },

  updateCartProduct : async (req: Request, res:Response) =>{
    //req params check
    const errors = resultValidator(req)
    if(errors.length > 0){
        return failurehandler(res, req.method, 400, errors);
}
    const {p_id} = req.params
    try {
        //@ts-ignore
        /* 
        let user = await User.findByPk(req.user.user_id);
        if(user === null){
            return failurehandler(res, req.method, 401, 'unautherized request');
        } */

        let cart: any = await Cart.findByPk(req.params.c_id);
        if(cart === null){
            return failurehandler(res, req.method, 400, 'cart not exixts')
            //@ts-ignore
        }else if(cart.user_id != req.user.user_id){
            return failurehandler(res, req.method, 401, 'unautherized request');
        }
        
        console.log(typeof cart.product_id)
        console.log(typeof req.params.p_id)
        if(cart.product_id !== req.params.p_id){
            return failurehandler(res, req.method, 400, 'product not found')
        }

        cart = await Cart.update({
            quantity: req.body.quantity
        },{
            where:{
                product_id: p_id
            }
        })
    
        successhandler(res, req.method, 201, 'Product updated');
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


export default cart;