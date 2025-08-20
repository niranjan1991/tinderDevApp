const express = require('express');
const cookieParser = require('cookie-parser');
const { connectToDatabase } = require('./config/database');
const app = express();
app.use(express.json());
app.use(cookieParser())
const authRouter = require('./routes/auth-routes');
const profileRouter = require('./routes/profile-routes');
const userRouter = require('./routes/user-routes');
const connectionRouter = require('./routes/connection-routes');


app.use('/', authRouter);
app.use('/', profileRouter);
app.use('/', userRouter);
app.use('/', connectionRouter);


connectToDatabase()
  .then(() => {
    app.listen(7000, () => {
      console.log('Database connected successfully')
      console.log('Server is running on http://localhost:7000');
    });
  })
  .catch((error) => {
    console.error('Error connecting to the database:', error)
  });





