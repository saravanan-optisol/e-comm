import { DataTypes, Model } from 'sequelize'
import db from '../config/dbconnection'
import Product from './product.model'
import User from './user.model'

interface cartInterface {
    cart_id?: number;
    product_id?: number,
    user_id?: number,
    quantity: number,
    isdelete?: number

}

export default class Cart extends Model<cartInterface> { }

Cart.init({
    cart_id: {
    type: DataTypes.INTEGER.UNSIGNED,
    autoIncrement: true,
    primaryKey: true,
  },
  quantity:{
      type: DataTypes.INTEGER,
      allowNull: false
  },
  isdelete: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
},{
    sequelize: db,
    tableName: 'carts'
})

Product.belongsToMany(User, {through: Cart, foreignKey: {name: 'product_id', allowNull: false}});
User.belongsToMany(Product, {through: Cart, foreignKey: {name: 'user_id', allowNull: false}});
