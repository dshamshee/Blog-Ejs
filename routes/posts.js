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
    const {title, body} = req.body;
    const post = await postModel.create({
        title,
        body,
        image: req.file.filename,
        author: user._id,
        username: user.username
    });
    console.log("First Blog Post Successfuly!");
    res.redirect('/');
})



module.exports = router;