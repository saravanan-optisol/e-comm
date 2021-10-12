import { DataTypes, Model } from 'sequelize'
import db from '../../config/db'

interface productInterface {
    product_name: String,
    title: String,
    brand: String
    seller_id: Number,
    imgsrc: String,
    prize: Number,
    category: String,
    description: String,
    }

export class Product extends Model<productInterface> { }        

Product.init({
    product_name: {
        type: DataTypes.STRING,
        allowNull : false
    },
    title: {
        type: DataTypes.STRING,
        allowNull : false,
    },
    brand: {
        type: DataTypes.STRING,
        allowNull : false
    },
    seller_id: {
        type: DataTypes.NUMBER,
        allowNull : false
    },
    imgsrc: {
        type: DataTypes.STRING,
        allowNull : false
    },
    category: {
        type: DataTypes.STRING,
        allowNull : false
    },
    prize: {
        type: DataTypes.NUMBER,
        allowNull : false
    },
    description: {
        type: DataTypes.NUMBER,
        allowNull : false
    },
    },{
    sequelize: db,
    tableName: 'products'
})