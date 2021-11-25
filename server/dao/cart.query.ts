import Cart from '../models/cart.model'

let cartQuery = {
    addNew: async (cartData: any, t: any) =>{
        const cart = await Cart.create(cartData, {transaction: t});
    },

    checkExists: async (cart_id: any, product_id: any) =>{
        let cart = await Cart.findOne({ where: { cart_id, product_id }});
        return cart;
    },

    updateProductQuantity: async (c_id: any, value: number, t: any) =>{
        //@ts-ignore
        let cart = await Cart.update({ quantity: value }, { where: { cart_id: c_id }}, { transaction: t })
    },

    removeProduct: async (cart_id: any, t: any) =>{
        //@ts-ignore
        let cart = await Cart.destroy({where: { cart_id}}, {transaction: t});
    }
}

export default cartQuery