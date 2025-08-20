const express = require('express');
const connectionRouter = express.Router();
const mongoose = require('mongoose');
const { validateToken } = require('../middleware/authentication');
const { ConnectionRequest } = require('../models/connection-request');
const { User } = require('../models/user');
const { CONNECTION_STATUS } = require('../enums/connection');


connectionRouter.post('/connect/:status/:id', validateToken, async (req, res) => {
  try {
    const fromUserId = req.user.id;
    const toUserId = req.params.id;
    const connectionStatus = req.params.status;

    if (!CONNECTION_STATUS.includes(connectionStatus)) {
      res.status(400).send({
        returnCode: 1,
        errorMsg: 'Invalid Status !!!!'
      })
    }

    if (!mongoose.Types.ObjectId.isValid(toUserId)) {
      return res.status(400).send({
        returnCode: 1,
        message: 'Invalid user ID format.',
      });
    };

    const isUserExists = await User.findById(toUserId);

    if (!isUserExists) {
      return res.status(400).send({
        returnCode: 1,
        message: 'User does not exist.',
      });
    };

    const isRequestExists = await ConnectionRequest.findOne({
      $or: [
        { fromUserId, toUserId },
        { toUserId, fromUserId }
      ]
    });

    if (isRequestExists) {
      return res.status(400).send({
        returnCode: 1,
        message: 'Connection request already exists.'
      });
    };

    const connectionRequest = new ConnectionRequest({
      fromUserId,
      toUserId,
      status: connectionStatus
    });

    const user = await connectionRequest.save();

    res.send({
      returnCode: 0,
      message: 'Connection request sent successfully.',
      data: user
    });


  } catch (error) {
    res.status(500).send({
      returnCode: 1,
      message: 'Error fetching connections',
      error: error.message
    });
  }
});

module.exports = connectionRouter;