import { DataTypes, Model } from "sequelize";
import db from '../config/dbconnection'
import User from './user.model'

export interface productInterface {
    product_id?: Number;
    product_name: String,
    title: String,
    seller_id?: Number,
    brand: String
    imgsrc: String,
    prize: Number,
    category: String,
    description: String,
    no_of_items: Number,
    is_delete?: number
    }

export default class Product extends Model<productInterface> {
    [x: string]: any
}        

Product.init({
    product_id: {
    type: DataTypes.INTEGER.UNSIGNED,
    autoIncrement: true,
    primaryKey: true,
  },
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
    imgsrc: {
        type: DataTypes.STRING,
        allowNull : false
    },
    category: {
        type: DataTypes.STRING,
        allowNull : false
    },
    prize: {
        type: DataTypes.INTEGER,
        allowNull : false
    },
    description: {
        type: DataTypes.STRING,
        allowNull : false
    },
    is_delete: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    no_of_items: {
        type: DataTypes.INTEGER,
        allowNull : false
    },
    },{
    sequelize: db,
    tableName: 'products'
})

User.hasMany(Product, {
    foreignKey: {
      name: 'seller_id',
      allowNull: false
    }
});
Product.belongsTo(User);

