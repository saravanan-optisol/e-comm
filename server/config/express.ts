let express = require('express');
let db = require('../models/index');
import swaggerUI from 'swagger-ui-express' 
import swaggerJsDoc from 'swagger-jsdoc'
import YAML from 'yamljs'
// const swaggerDocument = YAML.load('../swagger.yml')

module.exports = (app: any, config: any) =>{
    //swagger connection
    // app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerDocument));

    app.use(express.json({ limit: '50mb', extended: true }));

    //routes
    app.use('/auth', require('../routes/auth'));
    app.use('/user', require('../routes/user'));
    app.use('/product', require('../routes/product'));
    app.use('/cart', require('../routes/cart'));
    app.use('/review', require('../routes/review'));
    app.use('/order', require('../routes/order'));
}