import express, {Request, Response} from 'express';
const app = express();
import config from './config/config';
import db from './config/dbconnection'
require('./config/express')(app, config);

app.get('/', (req: Request, res: Response) => res.send('hello'))

db.sync().then(() =>{
    app.listen(config.port, () => {
        console.log(`Server running on ${config.port}`);
      });
}).catch((err: any) =>{
    console.log('catch' + err);
})
 
 