const express = require('express');
const app = express();
app.use(express.json());

app.use('/', (req, res, next) => {
  res.send('handling / route');
  next()
});

app.get('/getUser', (req, res) => {
  res.send({ key: 'Niranjan' });
});

app.post('/createUser', (req, res) => {
  console.log(req.body);
  if (!req.body || !req.body.userName) {
    return res.status(400).send({ returnCode: 1, message: 'Username is required' });
  }
  res.send({ returnCode: 0, message: 'User created successfully' });
});


app.get('/multiRoute',
  (req, res, next) => {
    next();
    console.log('First middleware');
    // res.send({ returnCode: 0, message: 'This is the first middleware' });
  },
  (req, res, next) => {
    console.log('Second middleware');
    res.send({ returnCode: 0, message: 'This is the second middleware' });
  }
);

app.listen(7000, () => {
  console.log('Server is running on http://localhost:7000');
});