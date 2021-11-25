import Product from '../models/product.model'

let productQuery = {
    newProduct: async (products: any) =>{
        const product = await Product.create(products);
        return product;
    },

    findProduct: async (product_id: any) =>{
        const product = await Product.findByPk(product_id);
        return product;
    },

    updateProduct: async (product_id: any, products: any) =>{
        const product = await Product.update(products, { where: { product_id: product_id }})
        return 'product updated'
    },

    getAllProduct: async ()=>{
        let product = await Product.findAll();
        return product;
    },

    getSellerProduct: async (seller_id: any)=>{
        let product = await Product.findAll({where: { seller_id: seller_id }});
        return product
    },

    getProductByCatogory: async (category: string) =>{
        let product = await Product.findAll({ where: { category: category }});
        return product;
    },

    getProductByName: async (name: string) =>{
        let product = await Product.findAll({ where: { product_name: name }});
        return product;
    },

    checkProductQuantity: async (product_id: any) =>{
        let product: any = await Product.findByPk(product_id);
        return product.quantity;
    },

    updateProductQuantity: async (product_id: any, value: any, t: any) =>{
        console.log('5')
        //@ts-ignore
        let product = await Product.update({ no_of_items: value}, {where: { product_id }}, {transaction: t})
    },

    deleteProduct: async (product_id: any) =>{
        const product  = await Product.destroy({ where: { product_id }})
    }
}

export default productQuery;