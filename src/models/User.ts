import { DataTypes, Model } from 'sequelize'
import db from '../../config/db'

interface userInterface {
    id? : String,
  username: String,
  email: String,
  password: String
  mobile?: Number,
  address?: String,
  city?: String,
  state?: String,
  country?: String,
  pincode?: Number
}

export default class User extends Model<userInterface> {
  [x: string]: any
}

User.init({
    username: {
        type: DataTypes.STRING,
        allowNull : false
    },
    email: {
        type: DataTypes.STRING,
        allowNull : false,
        unique: true
    },
    password: {
        type: DataTypes.STRING,
        allowNull : false
    },
    mobile: {
      type: DataTypes.INTEGER,
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
        type: DataTypes.INTEGER,
    }, 
},{
    sequelize: db,
    tableName: 'users'
})

  