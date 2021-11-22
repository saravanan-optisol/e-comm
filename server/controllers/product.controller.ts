import express, {Request, Response} from 'express'
import User from '../models/user.model'
import Product from '../models/product.model'
import bcrypt from 'bcryptjs'
import  jwt  from 'jsonwebtoken'
import config  from '../config/config'
const {resultValidator} = require('../middlewares/validator')

let product: any = {
    // @route POST product/newproduct    
    // @desc Upload new Product
    // @access public
   
    newProduct : async (req: Request, res:Response) =>{
    //req params check
    const errors = resultValidator(req)
    if(errors.length > 0){
        return failurehandler(res, req.method, 400, errors);
    }
    const {product_name, title, prize, brand, imgsrc, category, no_of_items, description} = req.body;
    try {
        //@ts-ignore
        const seller = await User.findByPk(req.user.user_id);
        if(seller === null){
            return failurehandler(res, req.method, 400, 'seller not found')
        }else if(seller.role_id !== 2){
            return failurehandler(res, req.method, 401, 'user did not have seller account')
        }
        const product = await Product.create({
            product_name: product_name,
            title: title,
            category: category,
            prize: prize,
            description: description,
            imgsrc: imgsrc,
            brand: brand,
            //@ts-ignore
            seller_id: req.user.user_id,
            no_of_items: no_of_items
        })
    
        successhandler(res, req.method, 201, product)
    } catch (err) {
        console.log(err);
        failurehandler(res, req.method, 500, 'server Error - ' + err)
    }
  },

    // @route PUT product/updateroduct/:p_id    
    // @desc update product
    // @access private
  updateProduct : async (req: Request, res:Response) =>{
      console.log('u[sate')
      console.log(req.params.p_id)
    //req params check
    const errors = resultValidator(req)
    if(errors.length > 0){
        return failurehandler(res, req.method, 400, errors);
    }

    const {product_name, title, prize, brand, imgsrc, category, no_of_items, description} = req.body;
    try {
        let product: any = await Product.findByPk(req.params.p_id);

        if(product === null){
            return failurehandler(res, req.method, 400, 'product not found')
            //@ts-ignore
        }else if(product.seller_id !== req.user.user_id ){
            return failurehandler(res, req.method, 401, 'this product is not yours')
        }

        product = await Product.update({
            product_name: product_name,
            title: title,
            category: category,
            prize: prize,
            description: description,
            imgsrc: imgsrc,
            brand: brand,
            no_of_items: no_of_items
        }, {
            where: {
                //@ts-ignore
                product_id: req.params.p_id
            }
        })
        successhandler(res, req.method, 201, 'product Updated')
    } catch (err) {
        console.log(err);
        return failurehandler(res, req.method, 500, 'server Error - ' + err)
    }
  },


    // @route GET product/getall    
    // @desc get all product
    // @access public
  getAllProduct: async(req: Request, res: Response)=>{
    try {
        //@ts-ignore
/*         let user: any = await User.findByPk(req.user.user_id)

            if(user === null){
                return res.status(400).json({msg: 'user not exists'})
            } */

            let product = await Product.findAll();
            return successhandler(res, req.method, 200, product)
    } catch (err) {
        console.log(err);
        return failurehandler(res, req.method, 500, 'server Error - ' + err)
    }
},

   // @route GET product/getall/seller    
    // @desc get all their uploaded product by seller
    // @access private
getAllProductBySeller: async(req: Request, res: Response)=>{
    try {
        //@ts-ignore
        let user: any = await User.findByPk(req.user.user_id)

            if(user === null){
                return failurehandler(res, req.method, 400, 'user not exists')
            }else if(user.role_id !== 2){
                return failurehandler(res, req.method, 401, 'unautherized user')
            }

            product = await Product.findAll({where: {
                //@ts-ignore
                seller_id: req.user.user_id
            }});

            if(product.length <= 0){
                return failurehandler(res, req.method, 400, 'seller not yet upload any product')
            }
            successhandler(res, req.method, 200, product)
    } catch (err) {
        console.log(err);
        failurehandler(res, req.method, 500, 'server Error - ' + err)
    }
},

    // @route GET product/get/p_id    
    // @desc get Product by Id
    // @access public
getProductbyID: async(req: Request, res: Response)=>{
    try {
        //@ts-ignore
        /* let user: any = await User.findByPk(req.user.user_id)

            if(user === null){
                return failurehandler(res, req.method, 400, 'user not exists')
            } */

            product = await Product.findByPk(req.params.p_id);

            if(product === null){
                return failurehandler(res, req.method, 400, 'product not found')
            }
            successhandler(res, req.method, 200, product)
    } catch (err) {
        console.log(err);
        failurehandler(res, req.method, 500, 'server Error - ' + err)
    }
},

// @route GET product/get/cat/:category    
    // @desc get all product by category
    // @access public
    getAllProductByCategory: async(req: Request, res: Response)=>{
        try {
            //@ts-ignore
            /* let user: any = await User.findByPk(req.user.user_id)
    
                if(user === null){
                    return failurehandler(res, req.method, 400, 'user not exists')
                } */
    
                product = await Product.findAll({where: {
                    //@ts-ignore
                    category: req.params.category
                }});

                if(product.length <= 0){
                    return failurehandler(res, req.method, 400, 'product does not exists under this category')
                }

                successhandler(res, req.method, 200, product)
        } catch (err) {
            console.log(err);
            failurehandler(res, req.method, 500, 'server Error - ' + err)
        }
    },

    // @route GET product/get/name/:name    
    // @desc get all product by category
    // @access public
    getAllProductByName: async(req: Request, res: Response)=>{
        try {
            //@ts-ignore
            /* let user: any = await User.findByPk(req.user.user_id)
    
                if(user === null){
                    return failurehandler(res, req.method, 400, 'user not exists')
                } */
    
                product = await Product.findAll({where: {
                    //@ts-ignore
                    product_name: req.params.name
                }});

                if(product.length <= 0){
                    return failurehandler(res, req.method, 400, 'product does not exists under this name')
                }

                successhandler(res, req.method, 200, product)
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

export default product;