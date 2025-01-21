const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {type: String, required: true, unique: true},
    username: {type: String, required: true, unique: true},
    bio: {type: String, default: 'Bio not set'},
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
    profile_picture: {type: String, default: './images/Default_User.png'},
})


module.exports = mongoose.model('user', userSchema);