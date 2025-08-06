const express = require('express');
const cookieParser = require('cookie-parser');
const { User } = require('./models/user');
const { connectToDatabase } = require('./config/database');
const { validateToken } = require('./middleware/authentication');

const app = express();
app.use(express.json());
app.use(cookieParser())

const ALLOWED_UPDATE_FIELDS = ['firstName', 'lastName', 'password', 'age', 'skills', 'photoUrl'];


app.post('/sign-up', async (req, res) => {
  try {
    const { firstName, lastName, email, password, age, gender, skills, photoUrl } = req.body;
    const hashPassword = await bcrypt.hash(password, 10);
    const createUser = new User({
      firstName,
      lastName,
      email,
      password: hashPassword,
      age,
      gender,
      skills,
      photoUrl
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


app.get('/feed', validateToken, async (req, res) => {
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

app.post('/getUser', validateToken, async (req, res) => {
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


app.delete('/deleteUser', validateToken, async (req, res) => {
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


app.patch('/updateUser', validateToken, async (req, res) => {
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

app.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await await User.findOne({ email: email });
    if (!user) {
      return res.status(404).send({ returnCode: 1, message: 'invalid Credentials' });
    };
    const isPasswordValid = await user.isPasswordValid(password);

    if (!isPasswordValid) {
      return res.status(404).send({ returnCode: 1, message: 'Incorrect password' });
    };
    const token = user.getJwtToken(); // used method from user model created to use as helper function
    res.cookie('token', token);
    res.send({ returnCode: 0, message: 'Login successful' });
  } catch (error) {
    res.status(500).send({
      returnCode: 1,
      message: 'Error logging in',
      error: error.message
    });
  }
}),


  app.get('/profile', validateToken, (req, res) => {
    try {
      res.send({
        user: req.user,
        returnCode: 0,
        message: 'Profile fetched successfully',
      })
    }
    catch (error) {
      res.status(500).send({
        returnCode: 1,
        message: 'Error fetching profile',
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





