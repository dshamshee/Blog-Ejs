const express = require('express');
const router = express.Router();
const userModel = require('../models/User');
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
                const token = jwt.sign({ email: createdUser.email, name: createdUser.name, id: createdUser._id }, "SecretString");
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
                const token = jwt.sign({ email: user.email, name: user.name, id: user._id }, "SecretString");
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

module.exports = router;