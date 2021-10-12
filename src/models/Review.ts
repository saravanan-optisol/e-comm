import { DataTypes, Model } from 'sequelize'
import db from '../../config/db'

interface reviewInterface {
    product_id: number,
    user_id: number,
    rating: number,
    comment: string
}

export class Review extends Model<reviewInterface> { }

Review.init({
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
    }
},{
    sequelize: db,
    tableName: 'reviews'
})