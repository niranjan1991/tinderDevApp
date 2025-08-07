const express = require('express');
const profileRouter = express.Router();
const { validateToken } = require('../middleware/authentication');



profileRouter.get('/profile', validateToken, (req, res) => {
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


module.exports = profileRouter;