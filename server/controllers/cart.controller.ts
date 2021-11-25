import express, {Request, Response} from 'express'
import Cart from '../models/cart.model'
const {resultValidator} = require('../middlewares/validator')
import userQuery from '../dao/user.query'
import productQuery from '../dao/product.query'
import db from '../config/dbconnection'
import cartQuery from '../dao/cart.query'

let cart: any = {
  addNew : async (req: Request, res:Response) =>{
    //req params check
    const errors = resultValidator(req)
    if(errors.length > 0){
        return failurehandler(res, req.method, 400, errors);
    }

    let t = await db.transaction();
    //@ts-ignore
    const {user_id} = req.user
    const {p_id}: any = req.params
    try {
        let user = await userQuery.findUser(user_id);
        if(user === null){
            return failurehandler(res, req.method, 401, 'unautherized request');
        }        

        let product = await productQuery.findProduct(p_id)
        if(product === null){
            return failurehandler(res, req.method, 400, 'product not found');
        }

        let checkExists = await cartQuery.checkExists(user_id, p_id);
        if(checkExists !== null){
            return failurehandler(res, req.method, 400, 'product already available in the cart')
        }

        let productQuantity = product.no_of_items;
        if(productQuantity <= 0){
            return failurehandler(res, req.method , 400, 'product currently not available')
        }

        const cartData = {user_id, product_id:p_id, quantity: 1}
        const cart = await cartQuery.addNew(cartData, t);
        const value: number = productQuantity - 1;
        const reduceQuantity = await productQuery.updateProductQuantity(p_id, value, t);

        await t.commit();
        successhandler(res, req.method, 201, 'Product added to your cart');
    } catch (err) {
        t.rollback();
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
    const t = await db.transaction();
    //@ts-ignore
    const {user_id} = req.user
    const {reqtype, c_id, p_id} = req.params

    try {
        let user = await userQuery.findUser(user_id);
        if(user === null){
            return failurehandler(res, req.method, 401, 'unautherized request');
        } 

        let checkExists: any = await cartQuery.checkExists(c_id, p_id);
        if(checkExists === null){
            return failurehandler(res, req.method, 400, 'product not there in your cart')
        }else if(checkExists.user_id !== user_id){
            return failurehandler(res, req.method, 401, 'unautherized request')
        }

        let product = await productQuery.findProduct(p_id)
        if(product === null){
            return failurehandler(res, req.method, 400, 'product not found');
        }

        let productQuantity = product.no_of_items;
        let updateQuantity: any;
        if(reqtype === 'inc'){
            updateQuantity = checkExists.quantity + 1;
            if(productQuantity <= 0){
            return failurehandler(res, req.method , 400, 'product currently not available')
        }

        const value: number = productQuantity - 1;
        const reduceQuantity = await productQuery.updateProductQuantity(p_id, value, t);
        const upatecart = await cartQuery.updateProductQuantity(c_id, updateQuantity, t);

        t.commit();
        return successhandler(res, req.method, 200, 'updated')
        }else if(reqtype === 'dec'){
            updateQuantity = checkExists.quantity - 1;

            const value: number = productQuantity + 1;
        const increaseQuantity = await productQuery.updateProductQuantity(p_id, value, t);
        const upatecart = await cartQuery.updateProductQuantity(c_id, updateQuantity, t);

        t.commit()
        return successhandler(res, req.method, 200, 'updated')
        }
    } catch (err) {
        console.log(err);
        failurehandler(res, req.method, 500, 'server Error - ' + err)
    }
  },

  removeCartProduct: async (req: Request, res: Response) =>{
    //@ts-ignore
    const {user_id} = req.user
    const {c_id, p_id} = req.params
    const t  = await db.transaction();
      try {
        const user = await userQuery.findUser(user_id)
        if(user === null){
            return failurehandler(res, req.method, 401, 'unautherized user');
        }

        const checkExists: any = await cartQuery.checkExists(c_id, p_id);
        if(checkExists === null){
            return failurehandler(res, req.method, 400, 'cart or product not found')
        }else if(checkExists.user_id !== user_id){
            return failurehandler(res, req.method, 400, 'unautherized')
        }
        
        let product = await productQuery.findProduct(p_id)
        if(product === null){
            return failurehandler(res, req.method, 400, 'product not found');
        }

        let productQuantity = product.no_of_items;
        const value: number = productQuantity + checkExists.quantity;
        const increaseQuantity = await productQuery.updateProductQuantity(p_id, value, t);
        const deletecart = await cartQuery.removeProduct(c_id, t);

        t.commit();
        successhandler(res, req.method, 200, 'Product removed from cart');
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