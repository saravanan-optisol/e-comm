import express, {Request, Response} from 'express';
const app = express();
import config from './config/config';
import db from './config/dbconnection'
require('./config/express')(app, config);

//sequelize connection and server
db.sync().then(() =>{
    app.listen(config.port, () => {
        console.log(`Server running on ${config.port}`);
      });
}).catch((err: any) =>{
    console.log('catch' + err);
})
 
 