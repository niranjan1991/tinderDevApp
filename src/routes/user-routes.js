const express = require('express');
const userRouter = express.Router();
const { validateToken } = require('../middleware/authentication');
const { User } = require('./../models/user');

const ALLOWED_UPDATE_FIELDS = ['firstName', 'lastName', 'password', 'age', 'skills', 'photoUrl'];


userRouter.get('/feed', validateToken, async (req, res) => {
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

userRouter.patch('/updateUser', validateToken, async (req, res) => {
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






module.exports = userRouter;
