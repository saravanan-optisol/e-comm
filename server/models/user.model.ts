import { DataTypes, Model } from "sequelize";
import db from '../config/dbconnection'

export interface userInterface {
    id? : Number,
    user_id?: number;
    username: string,
    email: string,
    password: string,
    otp?: any,
    address?: string,
    mobile?: string,
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
      otp: {
        type: DataTypes.INTEGER
      },
      address: {
        type: DataTypes.STRING,
      },
      mobile: {
        type: DataTypes.INTEGER,
      },
    },
    {
      sequelize: db,
      tableName: "user",
    });

User.addScope('withoutPassword', {
  attributes: { exclude: ['password'] }
})