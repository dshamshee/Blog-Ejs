const express = require('express');
const router = express.Router();
const isLoggedin = require('../middlewares/isLoggedin');
const postModel = require('../models/Post');



router.get('/',isLoggedin,async function(req, res){
    const user = req.user;
    const allPosts = await postModel.find().sort({createdAt:-1});
    console.log(allPosts);
    res.render('components/index', {user, allPosts});
})








module.exports = router;