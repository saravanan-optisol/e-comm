import express, {Request, Response} from 'express'
const PORT = process.env.PORT || 4500;
const app = express();
import db from '../config/db'

db.sync().then(() =>{
    console.log('connected db');
}).catch((err) =>{
    console.log(err);
})

app.use(express.json());
app.use('/api/user', require('./routes/api/user/user'));
app.use('/api/user_auth', require('./routes/api/user/user_auth'));

app.listen(PORT, ()=>{
    console.log('server running');
})