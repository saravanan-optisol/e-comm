import express, {Request, Response} from 'express';
const app = express();
import config from './config/config';
import db from './config/dbconnection'
require('./config/express')(app, config);
import swaggerUI from 'swagger-ui-express'      
import swaggerJsDoc from 'swagger-jsdoc'
import YAML from 'yamljs'
const swaggerDocument = YAML.load('./swagger.yml')

app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerDocument));
//sequelize connection and server
db.sync().then(() =>{
    app.listen(config.port, () => {
        console.log(`Server running on ${config.port}`);
      });
}).catch((err: any) =>{
    console.log('catch' + err);
})
 
 