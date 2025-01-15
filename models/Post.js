const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    title: { type: String, required: true },
    body: { type: String, required: true },
    image: {type: String, default: "https://images.pexels.com/photos/2101894/pexels-photo-2101894.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"},
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    username: String,
    createdAt: { type: Date, default: Date.now },
    like: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    // categories: [String],
    // tags: [String],
});

module.exports = mongoose.model('post', postSchema);