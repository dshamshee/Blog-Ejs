const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'user' },
    username: String,
    text: String,
    createdAt: { type: Date, default: Date.now },
  });


const postSchema = new mongoose.Schema({
    title: { type: String, required: true },
    body: { type: String, required: true },
    caption: { type: String, required: true },
    image: Buffer,
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'user' },
    username: String,
    createdAt: { type: Date, default: Date.now },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'user' }],
    comments: [commentSchema], // Add comments as an array of embedded documents
    // categories: [String],
    // tags: [String],
});

module.exports = mongoose.model('post', postSchema);