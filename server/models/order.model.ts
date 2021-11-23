import { DataTypes, Model } from 'sequelize'
import db from '../config/dbconnection'
import User from './user.model'
import OrderItem from './order_item.model'
import Product from './product.model'

interface orderInterface {
    order_id?: number;
    user_id?: number,
    status?: string,
    is_delete?: number
}

export default class Order extends Model<orderInterface> { }

Order.init({
    order_id: {
    type: DataTypes.INTEGER.UNSIGNED,
    autoIncrement: true,
    primaryKey: true,
  },
    status:{
      type: DataTypes.STRING,
      allowNull: false
  },
  is_delete: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
},{
    sequelize: db,
    tableName: 'orders'
})

User.hasMany(Order);
Order.belongsTo(User, {
    foreignKey: {
        name: 'user_id',
        allowNull: false,
    }
})

Product.belongsToMany(Order, {through: OrderItem, foreignKey: {name: 'product_id', allowNull: false}});
Order.belongsToMany(OrderItem, {through: OrderItem, foreignKey: {name: 'order_id', allowNull: false}});
