const mongoose = require('mongoose');

const User = mongoose.model('User', {
    name: { type: String, require: true },
    email: { type: String, require: true },
    bio: { type: String },
    niche: { type: String },
    stats: { type: Number },
    password: { type: String, require: true }

})

module.exports = User;