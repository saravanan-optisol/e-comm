import { DataTypes, Model } from 'sequelize'
import db from '../config/dbconnection'
import Order from './order.model'

interface orderItemInterface {
    orderItem_id?: number
    order_id?: number,
    quantity?: number,
    is_delete?: number
}

export default class OrderItem extends Model<orderItemInterface> { }

OrderItem.init({
    orderItem_id: {
    type: DataTypes.INTEGER.UNSIGNED,
    autoIncrement: true,
    primaryKey: true,
  },
  quantity: {
      type: DataTypes.INTEGER,
      allowNull: false
  },
  is_delete: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
},{
    sequelize: db,
    tableName: 'oderItems'
})
