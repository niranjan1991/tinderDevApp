const express = require('express');
const { connectToDatabase } = require('./config/database');

const app = express();
app.use(express.json());


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

