const express = require('express');
const userRouter = express.Router();
const validator = require('validator');
const { validateToken } = require('../middleware/authentication');
const { User } = require('./../models/user');
const { validateUpdateUserFields } = require('../utils/validation');
const bcrypt = require('bcrypt');

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

userRouter.get('/profile/view', validateToken, async (req, res) => {
  try {
    const user = req.user;
    res.send({
      returnCode: 0,
      message: 'User profile fetched successfully',
      data: user
    });
  } catch (error) {
    res.status(500).send({
      returnCode: 1,
      message: 'Error fetching user profile',
      error: error.message
    })
  }
});

userRouter.patch('/profile/edit', validateToken, async (req, res) => {
  try {
    const isProfileUpdateAllowed = validateUpdateUserFields(req);
    if (!isProfileUpdateAllowed) {
      throw new Error('Invalid fields in request body');
    };

    const user = req.user; // complete user object from the token validation middleware added to req.user
    const updateUser = user;

    Object.keys(req.body).forEach((field) => {
      updateUser[field] = req.body[field];
    });

    await updateUser.save();
    res.send({ returnCode: 0, message: 'User updated', data: user });
  } catch (error) {
    res.status(400).send({
      returnCode: 1,
      message: 'Error updating user',
      error: error.message
    });
  }
});


userRouter.post('/profile/password', validateToken, async (req, res) => {
  try {
    const { password, newPassword } = req.body || {};
    if (password === newPassword) throw new Error('Can not used same password')
    if (!validator.isStrongPassword(newPassword)) {
      throw new Error('New password is not strong enough');
    }

    const user = req.user;
    const isValidPassword = await user.isPasswordValid(password);
    if (!isValidPassword) throw new Error('Invalid Crdentials');
    const hashPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashPassword;
    await user.save();
    res.send({
      returnCode: 0,
      message: 'Password change successfully',
      data: user
    })
  } catch (error) {
    console.log(error)
    res.status(500).send({
      returnCode: 1,
      error: error?.message || '',
      message: 'Error in password update',
    })
  }
});



module.exports = userRouter;
