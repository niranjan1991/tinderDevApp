const express = require('express');
const { MongoClient } = require("mongodb");
const app = express();
const { isUserAuthenticated, isAdminAuthenticated } = require('../middleware/auth');
app.use(express.json());

const url = 'mongodb+srv://niranjanpawar2:BVA2ferpSz52lM3z@namstenodelatest.8n8quio.mongodb.net/';

const client = new MongoClient(url);

const connectToDatabase = async () => {
    try {
        await client.connect();
        const db = client.db("helloWorld");
        const collection = db.collection("user");
        // await collection.insertOne(newRecord); // created record // every time will get added a new record but with unique _id
        const document = await collection.find({}).toArray(); // find all documents
        console.log("Documents in 'user' collection:", document);
    } catch (error) {
        console.error("Error connecting to MongoDB:", error);
    }
}

connectToDatabase();



// app.use('/user', isUserAuthenticated); 
// if this line is uncommented, all user routes will require user authentication



app.use('/admin', isAdminAuthenticated);

app.get('/admin/getUser', (req, res) => {
  console.log('Admin route accessed');
  res.send({ returnCode: 0, key: 'Niranjan' });
});

app.use('/admin/getSalaryDetail', (req, res) => {
  try {
    res.send('admin details retrieved successfully');
  } catch (error) {
    console.error('Error in /admin/getSalaryDetail:', error);
    return res.status(500).send({ returnCode: 1, message: 'Internal Server Error' });
  }
});

app.use('/admin/getPersonalDetail', (req, res) => {
  res.send('admin personal details retrieved successfully');
});

app.use('/user/getUserPersonalDetail', (req, res) => {
  res.send('user personal details retrieved successfully');
});

app.use('/user/getUserSalarylDetail', isUserAuthenticated, (req, res) => {
  // handle single request which dos not require isUserAuthenticated authentication
  res.send('user salary details retrieved successfully');
});

app.use('/config', (req, res, next) => {
  res.send('server is up');
});

app.get('/getUser', (req, res) => {
  res.send({ key: 'Niranjan' });
});

app.post('/createUser', (req, res) => {
  if (!req.body || !req.body.userName) {
    return res.status(400).send({ returnCode: 1, message: 'Username is required' });
  }
  res.send({ returnCode: 0, message: 'User created successfully' });
});


app.use('/', (error, req, res, next) => {
  if (error) {
    console.error('Error in middleware:', error);
    return res.status(500).send({ returnCode: 1, message: 'Internal Server Error' });
  }
}); // should be the last middleware to catch errors

app.listen(7000, () => {
  console.log('Server is running on http://localhost:7000');
});