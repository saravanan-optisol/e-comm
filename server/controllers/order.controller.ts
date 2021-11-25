import express, {Request, Response} from 'express'
const {resultValidator} = require('../middlewares/validator')
import userQuery from '../dao/user.query'
import productQuery from '../dao/product.query'
import db from '../config/dbconnection'
import orderQuery from '../dao/order.query'

let order:any = {
    newOrder: async (req: Request, res: Response) =>{
        //req params check
        const errors = resultValidator(req)
        if(errors.length > 0){
            return failurehandler(res, req.method, 400, errors);
        }

        const t = await db.transaction();
        //@ts-ignore
        const {user_id} = req.user;
        const {product_id, quantity} = req.body;
        try {
            let user = await userQuery.findUser(user_id);
            if(user === null){
                return failurehandler(res, req.method, 401, 'unautherized request');
            }        

            let product = await productQuery.findProduct(product_id)
            if(product === null){
                return failurehandler(res, req.method, 400, 'product not found');
            }
            
            let productQuantity = product.no_of_items;
            if(productQuantity <= 0){
                return failurehandler(res, req.method , 400, `only ${productQuantity} are available`)
            }

            if(user.address === null){
                return failurehandler(res, req.method, 400, 'please update your address')
            }

            console.log('0')

            const value: number = productQuantity - quantity;
            const reduceQuantity = await productQuery.updateProductQuantity(product_id, value, t);

            let orderData = {user_id, no_of_items: 1, status: 0}    
            let order: any = await orderQuery.newOrder(orderData, t);
            console.log('2')   
            console.log(order);
            
            //@ts-ignore
            orderData = {order_id: order.order_id, product_id, quantity}
            let orders = await orderQuery.neworderProducts(orderData, t)
            console.log('4')

            console.log('6')
            await t.commit()
            successhandler(res, req.method, 201, 'Order placed')
        } catch (err) {
            t.rollback();
            console.log(err);
            failurehandler(res, req.method, 500, 'server Error - ' + err)
            
        }
    },

    getOrder: async (req: Request, res:Response) =>{
        //@ts-ignore
        const {user_id} = req.user
        try {
            let user = await userQuery.findUser(user_id);
            if(user === null){
                return failurehandler(res, req.method, 401, 'unautherized request');
            } 

            let order = await orderQuery.getOrder(user_id);
            if(order.length <= 0){
                return failurehandler(res, req.method, 400, 'Order not found')
            }

            successhandler(res, req.method, 200, order);
        } catch (err) {
            console.log(err);
            failurehandler(res, req.method, 500, 'server Error - ' + err)
        }
    },

    getOrderedItems: async (req: Request, res: Response) =>{
        //@ts-ignore
        const {user_id} = req.user
        const {o_id} = req.params
        try {
            let user = await userQuery.findUser(user_id);
            if(user === null){
                return failurehandler(res, req.method, 401, 'unautherized request');
            } 

            let orderedItems = await orderQuery.getOrderedItems(o_id)
            if(orderedItems.length <= 0){
                return failurehandler(res, req.method, 400, 'no product available under the order')
            }

            successhandler(res, req.method, 200, orderedItems);
        } catch (err) {
            console.log(err);
            failurehandler(res, req.method, 500, 'server Error - ' + err)
        }
    },

    trackOrder: async (req: Request, res: Response) =>{
        try {
            const order: any = await orderQuery.trackOrder(req.params.o_id);
            if(order === null){
                return failurehandler(res, req.method, 400, 'order not exists');
            }

            successhandler(res, req.method, 200, order.status);
        } catch (err) {
            console.log(err);
            failurehandler(res, req.method, 500, 'server Error - ' + err)
        }
    },

    updateArrivalLocation: async(req: Request, res: Response) =>{
        //@ts-ignore
        const {user_id} = req.user
        const {o_id} = req.params
        try {
            let user = await userQuery.findUser(user_id);
            if(user === null){
                return failurehandler(res, req.method, 401, 'unautherized request');
            }else if(user.role_id !== 3){
                return failurehandler(res, req.method, 401, 'unautherized request');
            } 

            const order: any = await orderQuery.trackOrder(req.params.o_id);
            if(order === null){
                return failurehandler(res, req.method, 400, 'order not exists');
            }

            const status = order.status + 1;
            const updateTrack = await orderQuery.updateTrack(o_id, status);

            successhandler(res, req.method, 200, 'updated')
        } catch (err) {
            console.log(err);
            failurehandler(res, req.method, 500, 'server Error - ' + err)
        }
    },

    cancelOrder: async (req: Request, res: Response) =>{
        //@ts-ignore
        const {user_id} = req.user
        const {o_id} = req.params
        try {
            const user = await userQuery.findUser(user_id)
            if(user === null){
                return failurehandler(res, req.method, 401, 'unautherized user');
            }
            
            let order: any = await orderQuery.findOrder(o_id);
            if(order === null){
                return failurehandler(res, req.method, 400, 'Order not found')
            }else if(order.user_id !== user_id){
                return failurehandler(res, req.method, 400, 'order not yours')
            }

            const cancelOrder = await orderQuery.cancelOrder(o_id);
            successhandler(res, req.method, 400, 'order cancelled')
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

export default order;