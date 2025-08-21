const mongoose = require('mongoose');
const { Schema } = mongoose;
const { CONNECTION_STATUS } = require('../enums/connection');

const connectionRequestSchema = new Schema({
    fromUserId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'User' 
        /**
            * ref :- joins the table to get information about user detail in connecionSchema
            * Always use schema name  
            * never use table name
            * can populate user info in mongoose operation - find().populate('fromUserId')
            * if populate is empty it will not return anything
         */
    },
    toUserId: {
        type: Schema.Types.ObjectId,
        required: true,
    },
    status: {
        type: String,
        enum: CONNECTION_STATUS,
        message: `{Value} is not a valid status`,
        required: true
    }
});

connectionRequestSchema.index({ fromUserId: 1, toUserId: 1 });

const ConnectionRequest = mongoose.model('ConnectionRequest', connectionRequestSchema);

module.exports = {
    ConnectionRequest
}