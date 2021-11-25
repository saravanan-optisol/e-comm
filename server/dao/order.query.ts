import order from "../controllers/order.controller";
import Order from "../models/order.model";
import OrderItem from "../models/order_item.model";

let orderQuery = {
    newOrder: async (orderData: object, t: any) =>{
        console.log('1')
        const order = await Order.create(orderData, {transaction: t});
        return order;
    },

    neworderProducts: async (orderData: object, t: any) =>{
        const order = await OrderItem.create(orderData, {transaction: t})
    },

    getOrder: async (user_id: any) =>{
        const order = await Order.findAll({ where: { user_id: user_id }})
        return order;
    },

    findOrder: async (order_id: any) =>{
        const order = await Order.findByPk(order_id);
        return order;
    },

    getOrderedItems: async (order_id: any) =>{
        const order = await OrderItem.findAll({where : { order_id }})
        return order;
    },

    trackOrder: async (order_id: any) =>{
        let order = await Order.findByPk(order_id);
        return order;
    },

    updateTrack: async(order_id: any, status: any) =>{
        let order = await Order.update({ status }, { where: { order_id }})
    },

    cancelOrder: async(order_id: any) =>{
        let order = await Order.destroy({where: {order_id}});
    }
}

export default orderQuery