var jwt = require('jsonwebtoken');
const { User } = require('../models/user');

const validateToken = async (req, res, next) => {
    try {
        const { token } = req.cookies;
        if (!token || typeof token !== 'string') {
            throw new Error('Unauthorized access');
        }
        const { _id } = jwt.verify(token, 'DEV_SECRET');
        const user = await User.findById(_id);
        if (!user || user._id.toString() !== _id) {
            throw new Error('User not found');
        }
        req.user = user;
        next();
    } catch (error) {
        res.status(401).send({
            returnCode: 1,
            error: error.message
        });
    }


};

module.exports = {
    validateToken
};