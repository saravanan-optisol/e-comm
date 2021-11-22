let express = require('express');
let db = require('../models/index');
import swaggerUI from 'swagger-ui-express' 
import swaggerJsDoc from 'swagger-jsdoc'

module.exports = (app: any, config: any) =>{
    //swagger connection
    app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerJsDoc(config.options)));

    app.use(express.json({ limit: '50mb', extended: true }));

    //routes
    app.use('/auth', require('../routes/auth'));
    app.use('/user', require('../routes/user'));
    app.use('/product', require('../routes/product'));
    app.use('/cart', require('../routes/cart'));
}