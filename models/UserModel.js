const mongoose = require('mongoose');


var userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        index: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    mobile: {
        type: String,
        required: false,
        unique: true,
    },
    is_Admin: {
        type: Boolean,
        default: false,
    },
    password: {
        type: String,
        required: true,
        matchMedia: /^[a-zA-Z0-9]{8,30}$///password should be alphanumeric and 8-30 characters long,
    },
},
    {
        timestamps: {
            createdAt: 'created_at',
            updatedAt: 'updated_at'
        }
    }
);


module.exports = mongoose.model('User', userSchema);