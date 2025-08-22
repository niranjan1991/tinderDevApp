const express = require('express');
const { validateToken } = require('../middleware/authentication');
const userRouter = express.Router();
const { User } = require('./../models/user');
const { ConnectionRequest } = require('../models/connectionRequest');
const { CONNECTION_STATUS, CONNECTION_REVIEW_STATUS } = require('../enums/connection')

/**
    * fromUserId: Who sent the request
    * toUserId: Who received the request
 */


/**
       * get connection for loggedInUser
       * status should be accepted
       * return data should have name photo information (safe info)
*/
userRouter.get('/user/getConnection', validateToken, async (req, res) => {

    try {
        const loggedInUser = req.user.id;
        const userConnection = await ConnectionRequest.find({
            toUserId: loggedInUser, // all records will fetch against this id
            status: CONNECTION_STATUS[0]
        }).populate('fromUserId', ['firstName', 'lastName']);

        res.send({
            statusCode: 0,
            list: userConnection,
            message: userConnection?.length === 0 ? 'No Connections for acceptance' : 'List of connections'
        })

    } catch (error) {
        res.status(500).send({
            statusCode: 1,
            message: error
        })
    }
});

userRouter.get('/user/feed', validateToken, async (req, res) => {
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

/**
    * loggedInUser id to check
    * user should see the accepted request 
    * sent - accepted && recived - accepted
    * fromUser -> loggedInUser && toUserId -> loggedInUser (it will check in both acount)
*/

userRouter.get('/user/friendList', validateToken, async (req, res) => {
    try {
        const loggedInUser = req.user; 
        console.log(loggedInUser); 
        const userList = await ConnectionRequest.find({
            $or: [
                { toUserId: loggedInUser._id, status: CONNECTION_REVIEW_STATUS[0] }, // 1st anuja to-user-id accepted
                { fromUserId: loggedInUser._id, status: CONNECTION_REVIEW_STATUS[0] } // 2nd niranjan - from-user-id : accepted
            ],
        })
            .populate(
                'fromUserId', ['firstName', 'lastName', 'gender', 'skills', 'photoUrl'] // Niranjan Detail
            )
            .populate(
                'toUserId', ['firstName', 'lastName', 'gender', 'skills', 'photoUrl'] // - Anuja Detail
            );

            /**
             * Anuja is reciever (toUser)
             * she login & see the request
             * she accpet request of Niranjan (fromUser)
             * now db hav record where toUser[Anuja] -> fromUser[Niranjan]
             * As Anuja is loggedInUser & want to see the connection
             * she will find in DB with loggedInUserID of (toUser - accepted & fromUser -> accpeted with status of accpeted)
             * Anuja got the request including her (As she also sent request to some-one (Dhairya));
             * Anuja is seeing herself in connection as well (She sent request & some one has accpeted. Anuja is FromUser in this case)
             * we will iterate the list & check if userList.map -> item.fromUser.id === loggedInUser.id ? return item.fromUser;
            */
           
        const showUserList = userList?.map((item) => {
            if (item.fromUserId._id.toString() === loggedInUser._id.toString()) {
                return item.toUserId;
            }
            return item.fromUserId
        })

        res.send({
            statusCode: 0,
            list: showUserList,
        })

    } catch (error) {
        res.status(500).send({
            statusCode: 1,
            message: error
        })
    }
});


module.exports = userRouter;