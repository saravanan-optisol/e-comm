import { DataTypes, Model } from 'sequelize'
import db from '../config/dbconnection'

interface reviewInterface {
    review_id?: number;
    product_id: number,
    user_id: number,
    rating: number,
    comment: string,
    is_delete?: number
}

export default class Review extends Model<reviewInterface> { }

Review.init({
    review_id: {
    type: DataTypes.INTEGER.UNSIGNED,
    autoIncrement: true,
    primaryKey: true,
  },
    product_id: {
        type: DataTypes.NUMBER,
        allowNull : false
    },
    user_id: {
        type: DataTypes.NUMBER,
        allowNull : false
    },
    rating: {
        type: DataTypes.NUMBER,
        allowNull : false
    },
    comment: {
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