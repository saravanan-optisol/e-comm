import { Sequelize } from "sequelize";
import config from '../config/config'

const {database, username, password, option} = config;
const db = new Sequelize(database, username, password, option);

export default db;