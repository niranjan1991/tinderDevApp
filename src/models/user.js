const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
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
                if (!validator.isEmail(email)) {
                    throw new Error('Invalid email format');
                }
            }
        },
        password: {
            type: String,
            required: true,
            validate: (password) => {
                if (!validator.isStrongPassword(password)) {
                    throw new Error('Password must be at least 6 characters long');
                }
            }

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
        },
        photoUrl: {
            type: String,
            validate: (url) => {
                if (url && !validator.isURL(url)) {
                    throw new Error('Invalid URL format');
                }
            }

        },
    },
    {
        timestamps: true
    }
);

userSchema.methods.getJwtToken = function () {
    const user = this; // reference to the current user instance
    const token = jwt.sign({ _id: user._id },
        'DEV_SECRET',
        { expiresIn: '1h' }
    );
    return token;
};

userSchema.methods.isPasswordValid = async function (password) {
    const user = this;
    const hashedPassword = user.password;
    const isPasswordValid = await bcrypt.compare(password, hashedPassword);
    return isPasswordValid;
}

const User = mongoose.model('User', userSchema);

module.exports = {
    User
}