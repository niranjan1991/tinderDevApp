
const mongoose = require('mongoose');
const validator = require('validator');
const { Schema } = mongoose;

const userSchema = new Schema(
    {
        firstName: {
            type: String,
            required: true,
        },
        lastName: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
            lowercase: true,
            unique: true,
            trim: true,
            validate: (email) => {
                if(!validator.isEmail(email)){
                    throw new Error('Invalid email format');
                }
            }
        },
        password: {
            type: String,
            required: true,
            minlength: 6,
        },
        age: {
            type: Number,
            required: true,
            min: 18
        },
        gender: {
            type: String,
            required: true,
            validate: (value) => {
                if (!['m', 'f', 'other'].includes(value.toLowerCase())) {
                    throw new Error('Invalid gender');
                }
            }
        },
        skills: {
            type: [String],
            validate: (skillsArr) => {
                if (skillsArr?.length > 5) {
                    throw new Error('Skills cannot exceed 5 items');
                }
            }
        }
    },
    {
        timestamps: true
    }
);

const User = mongoose.model('User', userSchema);

module.exports = {
    User
}