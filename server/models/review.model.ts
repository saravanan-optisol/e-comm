import { DataTypes, Model } from 'sequelize'
import db from '../config/dbconnection'
import Product from './product.model'
import User from './user.model'

interface reviewInterface {
    review_id?: number;
    product_id?: number,
    user_id?: number,
    comment?: string,
    rating?: number,
    is_delete?: number

}

export default class Review extends Model<reviewInterface> { }

Review.init({
    review_id: {
    type: DataTypes.INTEGER.UNSIGNED,
    autoIncrement: true,
    primaryKey: true,
  },
  rating:{
      type: DataTypes.INTEGER,
      allowNull: false
  },
  comment:{
      type: DataTypes.STRING,
      allowNull: false
  },
  is_delete: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
},{
    sequelize: db,
    tableName: 'reviews'
})

Product.belongsToMany(User, {through: Review, foreignKey: {name: 'product_id', allowNull: false}});
User.belongsToMany(Product, {through: Review, foreignKey: {name: 'user_id', allowNull: false}});
