const express = require('express');
const { connectToDatabase } = require('./config/database');
const { User } = require('./models/user');
const app = express();
app.use(express.json());

const ALLOWED_UPDATE_FIELDS = ['firstName', 'lastName', 'password', 'age', 'skills'];


app.post('/sign-up', async (req, res) => {
  try {
    console.log(req.body);
    const { firstName, lastName, email, password, age, gender, skills } = req.body;
    const createUser = new User({
      firstName,
      lastName,
      email,
      password,
      age,
      gender,
      skills
    });
    await createUser.save();
    res.send({ retunCode: 0, message: 'User created successfully' });
  } catch (error) {
    res.status(500).send({
      returnCode: 1,
      message: 'Error creating user',
      error: error.message
    })
  }
});


app.get('/feed', async (req, res) => {
  try {
    const users = await User.find({}); // return all matching documents in array
    if (users.length === 0) {
      return res.status(404).send({ returnCode: 1, message: 'No users found' });
    }
    res.send({ returnCode: 0, message: 'Users fetched successfully', data: users });
  } catch (error) {
    res.status(500).send({
      returnCode: 1,
      message: 'Error fetching users',
      error: error.message
    });
  }
});

app.post('/getUser', async (req, res) => {
  try {
    console.log(req.body.firstName);
    const users = await User.findOne({ firstName: req.body.firstName }); // return single seach in object
    console.log(users);
    if (!users) {
      return res.status(404).send({ returnCode: 1, message: 'No user found' });
    }
    res.send({ returnCode: 0, message: 'Users fetched successfully', data: users });
  } catch (error) {
    res.status(500).send({
      returnCode: 1,
      message: 'Error fetching users',
      error: error.message
    });
  }
});


app.delete('/deleteUser', async (req, res) => {
  try {
    const { _id } = req.body;
    const user = await User.findByIdAndDelete(_id);
    if (!user) {
      return res.status(404).send({ returnCode: 1, message: 'User not found' });
    }
    res.send({ returnCode: 0, message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).send({
      returnCode: 1,
      message: 'Error deleting user',
      error: error.message
    });
  }
});


app.patch('/updateUser', async (req, res) => {
  try {
    /**
     * in this case we are using patch method to update the user
     * but validation is not done here
     * so user can update any field
     * to avoid this we can use third params which is options { runValidators: true } 
     */
    const { _id } = req.body;
    const filterData = {};
    ALLOWED_UPDATE_FIELDS.forEach((field) => {
      if (req.body[field] !== undefined) {
        filterData[field] = req.body[field];
      }
    });
    
    const user = await User.findByIdAndUpdate(
      _id,
      filterData,
      { runValidators: true }
    );
    if (!user) {
      return res.status(404).send({ returnCode: 1, message: 'User not found' });
    }
    res.send({ returnCode: 0, message: 'User updated successfully' });
  } catch (error) {
    res.status(500).send({
      returnCode: 1,
      message: 'Error updating user',
      error: error.message
    });
  }
});



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





