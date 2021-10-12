import {Sequelize} from 'sequelize'

const db = new Sequelize("sequel_db","root","",{
    dialect : 'mysql',
    logging : false
} )

export default db;
  