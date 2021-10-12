import { DataTypes, Model } from 'sequelize'
import db from '../../config/db'

interface cartInterface {
    product_id: number,
    user_id: number
}

export class Cart extends Model<cartInterface> { }

Cart.init({
    product_id: {
        type: DataTypes.NUMBER,
        allowNull : false
    },
    user_id: {
        type: DataTypes.NUMBER,
        allowNull : false
    }
},{
    sequelize: db,
    tableName: 'carts'
})