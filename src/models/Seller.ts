import { DataTypes, Model } from 'sequelize'
import db from '../../config/db'
  
interface sellerInterface {
    id?: Number
seller_name: String,
email: String,
password: String
mobile?: Number,
address?: String,
city?: String,
state?: String,
country?: String,
pincode?: Number
}

export default class Seller extends Model<sellerInterface> {
  [x: string]: any
}

Seller.init({
    seller_name: {
        type: DataTypes.STRING,
        allowNull : false
    },
    email: {
        type: DataTypes.STRING,
        allowNull : false,
        unique: true,
        primaryKey: true
    },
    password: {
        type: DataTypes.STRING,
        allowNull : false
    },
    mobile: {
    type: DataTypes.NUMBER,
    },
    address: {
        type: DataTypes.STRING,
    },
    city: {
        type: DataTypes.STRING,
    },
    state: {
    type: DataTypes.STRING,
    },
    country: {
        type: DataTypes.STRING,
    },
    pincode: {
        type: DataTypes.NUMBER,
    },

},{
    sequelize: db,
    tableName: 'sellers'
})

    