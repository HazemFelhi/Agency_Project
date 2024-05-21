const mongoose = require('mongoose');
const {roles} = require('../utils/constants')

const User = mongoose.model('User', {
    name: { type: String, require: true },
    email: { type: String, require: true },
    bio: { type: String },
    niche: { type: String },
    stats: { type: Number },
    password: { type: String, require: true },
    role: {
        type: String,
        enum: [roles.admin, roles.creator, roles.brand],
        default: roles.creator
      }

})

module.exports = User;