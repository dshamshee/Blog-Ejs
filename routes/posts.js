const express = require('express');
const router = express.Router();
const postModel= require('../models/Post');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const isLoggedin = require('../middlewares/isLoggedin');
const blogUploads = require('../config/post_multer_config');




router.get('/create/:userid',isLoggedin, async function(req, res){
    const user = req.user;
    res.render('posts/create', {user});
})


router.post('/create',blogUploads.single('image'), isLoggedin, async function(req, res){
    const user = req.user;
    const {title, caption, body} = req.body;
    let image = 'default.jpg';
    if(req.file){
        image = req.file.filename;
    }
    const post = await postModel.create({
        title,
        caption,
        body,
        image,
        author: user._id,
        username: user.username
    });
    res.redirect('/');
});


router.get('/view/:id',isLoggedin,async function(req, res){
    const id = req.params.id;
    const postID = req.params.id;
    const post = await postModel.findById({_id: postID});
    const user = req.user;
    res.render('posts/viewPost',{user, post});
});


router.get('/like/:id',isLoggedin, async function(req, res){
    const post = await postModel.findById({_id: req.params.id}).populate('author');

    if(post.likes.indexOf(req.user._id)=== -1 ){
        post.likes.push(req.user._id); // Add the user's id to the likes array
    }
    else{
        post.likes.splice(post.likes.indexOf(req.user._id), 1);
    }
    await post.save();
    res.redirect('/');
})

router.get('/profile/like/:id',isLoggedin, async function(req, res){
    const post = await postModel.findById({_id: req.params.id}).populate('author');

    if(post.likes.indexOf(req.user._id)=== -1 ){
        post.likes.push(req.user._id); // Add the user's id to the likes array
    }
    else{
        post.likes.splice(post.likes.indexOf(req.user._id), 1);
    }
    await post.save();
    res.redirect('/user/profile');
})


router.get('/delete/:id',async function(req, res){
    await postModel.deleteOne({_id: req.params.id});
    console.log("Post deleted successfully!");
    res.redirect('/user/profile');
});


router.get('/comments/:id', isLoggedin, async function (req, res) {
    try {
        const postId = req.params.id;
        const post = await postModel.findById(postId).select('comments').populate('comments.userId', 'username');
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }
        // res.json(post.comments);
        res.render('components/index')
    } catch (error) {
        console.error('Error fetching comments:', error);
        res.status(500).json({ message: 'Failed to fetch comments' });
    }
});




router.post('/comment/:id', isLoggedin, async function (req, res) {
    try {
        const postId = req.params.id;
        const { text } = req.body;

        // Find the post and push a new comment
        const post = await postModel.findById(postId);
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        post.comments.push({
            userId: req.user._id,
            username: req.user.username,
            text,
        });

        await post.save();
        res.redirect('/');
    } catch (error) {
        console.error('Error adding comment:', error);
        res.status(500).json({ message: 'Failed to add comment' });
    }
});


module.exports = router;