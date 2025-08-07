const express = require('express');
const validator = require('validator');
const authRouter = express.Router()
const bcrypt = require('bcrypt');
const { User } = require('./../models/user');


authRouter.post('/sign-up', async (req, res) => {
  try {
    const { firstName, lastName, email, password, age, gender, skills, photoUrl } = req.body;
    if (!validator.isStrongPassword(password)) {
      throw new Error('Password must be at least 6 characters long');
    }
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
    await createUser.save({ validateBeforeSave: true });
    await User.syncIndexes()
    res.send({ retunCode: 0, message: 'User created successfully' });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).send({
        returnCode: 1,
        message: 'Email already exists',
        error: error.message
      });
    }
    res.status(500).send({
      returnCode: 1,
      message: 'Error creating user',
      error: error.message
    })
  }
});


authRouter.post('/login', async (req, res) => {
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
    const token = user.getJwtToken();
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



  module.exports = authRouter;