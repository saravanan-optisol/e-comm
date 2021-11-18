/* 'use strict';

const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const basename = path.basename(__filename);
//@ts-ignore
const env = process.env.NODE_ENV || 'development';
//@ts-ignore
const config = require(__dirname + '/../config/default')[env];
const db : any= {};

let sequelize: any;
if (config.use_env_variable) {
  console.log('env variable');
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  console.log('default')
  sequelize = new Sequelize(config.database, config.username, config.password, config);
}

fs
  .readdirSync(__dirname)
  .filter((file : String) => {
    return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
  })
  .forEach((file : any) => {
    const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
    db[model.name] = model;
  });

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

export default db;
 */