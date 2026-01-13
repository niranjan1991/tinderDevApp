const express = require('express');
const connectionRouter = express.Router();
const mongoose = require('mongoose');
const { validateToken } = require('../middleware/authentication');
const { ConnectionRequest } = require('../models/connectionRequest');
const { User } = require('../models/user');
const { CONNECTION_STATUS, CONNECTION_REVIEW_STATUS } = require('../enums/connection');


// interest ||  ignore
connectionRouter.post('/connect/send/:status/:id', validateToken, async (req, res) => {
  try {
    const fromUserId = req.user.id;
    const toUserId = req.params.id;
    const connectionStatus = req.params.status;

    if (fromUserId === toUserId) {
      return res.status(400).send({
        returnCode: 1,
        message: 'Can not send request to yourself !!!!'
      })
    }

    if (!CONNECTION_STATUS.includes(connectionStatus)) {
      return res.status(400).send({
        returnCode: 1,
        message: 'Invalid Status !!!!'
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
        { fromUserId: toUserId, toUserId: fromUserId }
      ]
    });

    if (isRequestExists) {
      return res.status(400).send({
        returnCode: 1,
        message: 'Connection request already exists.'
      });
    };

    const storeConnectionReq = new ConnectionRequest({
      fromUserId,
      toUserId,
      status: connectionStatus
    });

    const user = await storeConnectionReq.save();

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


// accepted ||  rejected
connectionRouter.post('/connect/review/:status/:id', validateToken, async (req, res) => {
  try {
    const { id, status } = req.params;
    const { id: loggedInUser, firstName: fromUserFirstName, lastName: fromUserLastName } = req.user;
    const { firstName: toUserFirstName, lastName: toUserLasttName } = await User.findById(id) || {};

    if (loggedInUser === id) {
      return res.status(400).send({
        returnCode: 1,
        message: `sender is ${fromUserFirstName} & reciver is ${toUserFirstName} same !!!!`
      })
    }

    if (!CONNECTION_REVIEW_STATUS.includes(status)) {
      return res.status(400).send({
        statusCode: 1,
        message: 'Status is invalid'
      });
    };

    const connectionRequest = await ConnectionRequest.findOne({
      fromUserId: id,
      toUserId: loggedInUser
    });

    if (!connectionRequest) {
      return res.status(400).send({
        statusCode: 0,
        message: 'No connection request found from this user.'
      });
    }

    if (connectionRequest.status !== CONNECTION_STATUS[0]) {
      return res.status(400).send({
        statusCode: 1,
        message: `Cannot proceed. Request has already been '${connectionRequest.status}'.`,
      });
    }

    connectionRequest.status = status;
    const data = await connectionRequest.save();

    res.send({
      statusCode: 0,
      message: `Connection Request is ${status}`,
      data: data
    });

  } catch (error) {
    res.status(500).send({
      statusCode: 1,
      message: 'Error to check !!!!!!!'
    })
  }
});

module.exports = connectionRouter;