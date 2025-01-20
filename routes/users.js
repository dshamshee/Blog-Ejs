require('dotenv').config();
const express = require('express');
const router = express.Router();
const userModel = require('../models/User');
const postModel = require('../models/Post');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const isLoggedin = require('../middlewares/isLoggedin');
const upload = require('../config/multer-config');

// Display User SignUp page 
router.get('/register', function (req, res) {
    res.render('users/register');
})
// Register a new User
router.post('/register',upload.single('profile_picture'), async function (req, res) {
    const { name, email, username, password } = req.body;
    let user = await userModel.findOne({ email: email });
    if (user) {
        console.log("Email already exists enter differenct email and try again");
        return res.redirect('/');
    }

    try {
        bcrypt.genSalt(10, function (err, salt) {
            bcrypt.hash(password, salt, async function (err, hash) {
                const createdUser = await userModel.create({
                    name,
                    username,
                    email,
                    password: hash,
                    profile_picture: req.file.filename
                })
                const token = jwt.sign({ email: createdUser.email, name: createdUser.name, id: createdUser._id }, process.env.JWT_SECRET_KEY );
                res.cookie("token", token);
                res.redirect('/');
            })
        })
    } catch (error) {
        console.log(error.message);
        res.redirect('/');
    }

})


router.get('/login', function (req, res) {
    res.render('users/login');
})

router.post('/login',async function (req, res) {
    const { email, password } = req.body;
    const user =await userModel.findOne({ email: email });
    if (!user) return console.log("User not Found");

    try {
        bcrypt.compare(password, user.password, function (err, result) {
            if(result){
                const token = jwt.sign({ email: user.email, name: user.name, id: user._id }, process.env.JWT_SECRET_KEY);
                res.cookie("token", token);
                res.redirect('/');
            } else{
                console.log("Password is incorrect");
                res.redirect('/');
            }
        })
    } catch (error) {
        console.log(error);
    }
})

router.get('/logout', function(req, res){
    res.cookie("token", "");
    res.redirect('/');
})


router.get('/profile', isLoggedin,async function(req, res){
    const user = req.user;
    const posts = await postModel.find({ author: user._id });
    res.render('users/profile', {user, posts});
})


router.post('/bio', isLoggedin, async function(req, res){
    const { bio } = req.body;
    req.user.bio = bio;
    await req.user.save();
    res.redirect('/user/profile');
})


router.post('/uploadProfilePicture', isLoggedin, upload.single('profile_picture'), async function(req, res){
    req.user.profile_picture = req.file.filename;
    await req.user.save();
    res.redirect('/user/profile');
})


router.post('/find',isLoggedin, async function(req, res){
    const { searchInput } = req.body;
    const user = req.user;
    const SearchedUsers = await userModel.find({ username: { $regex: searchInput, $options: 'i' } });
    res.render('users/searchedUsers', { SearchedUsers, user });
});


router.get('/profile/:id',async function(req, res){
    const user = await userModel.findOne({_id: req.params.id});
    const posts = await postModel.find({ author: user._id });
    res.render('users/profile', {user, posts});
})

module.exports = router;