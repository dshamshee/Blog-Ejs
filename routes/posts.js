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
    const post = await postModel.create({
        title,
        caption,
        body,
        image: req.file.filename,
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
})

module.exports = router;