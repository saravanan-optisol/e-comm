import  express  from 'express';
import db from './models/'
const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());

//routes
app.use('/api/user', require('./routes/api/user'));
app.use('/api/auth', require('./routes/api/auth'));

db.sequelize
  .sync()
  .then(() => {
    app.listen(PORT, () => console.log('server running....'));
  })
  .catch((err: any) => {
    console.log('err sequel: ' + err);
  });