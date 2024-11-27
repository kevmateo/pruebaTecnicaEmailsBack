
import express from 'express';
import sequelize from './sequalize/database.js';
import dotevn from 'dotenv';
import './models/index.js';
import EmailRouter from './routes/email.route.js';
import UserRouter from './routes/user.route.js';
import cors from 'cors';

dotevn.config();
const PORT = process.env.PORT || 3000;

const app = express();
app.use(cors())
app.use(express.json());

app.use('/email', EmailRouter);
app.use('/user', UserRouter);




sequelize.sync({ alter: true })
  .then(() => {
    console.log('Base de datos sincronizada correctamente.');
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  })
  .catch(error => {
    console.error('Error syncing database:', error);
  });

