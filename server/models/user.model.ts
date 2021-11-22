import { DataTypes, Model } from "sequelize";
import db from '../config/dbconnection'
import Product from "./product.model";
export interface userInterface {
    user_id?: number;
    username: string,
    email: string,
    password: string,
    role_id: Number,
    otp?: any,
    address?: string,
    mobile?: string,
    is_delete?: number
  }
  export default class User extends Model<userInterface> {
    [x: string]: any
  }
  
  User.init({
        user_id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
      },
      username: {
        allowNull: false,
        unique: true,
        type: DataTypes.STRING,
      },
      password: {
        allowNull: false,
        type: DataTypes.STRING,
      },
      email: {
        allowNull: false,
        type: DataTypes.STRING,
        unique: true,
      },
      role_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      otp: {
        type: DataTypes.INTEGER
      },
      address: {
        type: DataTypes.STRING,
      },
      mobile: {
        type: DataTypes.INTEGER,
      },
      is_delete: {
        type: DataTypes.INTEGER,
        defaultValue: 0
      },
    },
    {
      sequelize: db,
      tableName: "users",
    });

User.addScope('withoutPassword', {
  attributes: { exclude: ['password', 'otp'] }
})

User.addScope('getOTP', {
  attributes:{exclude: ['password']}
})