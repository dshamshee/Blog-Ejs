require('dotenv').config();
const userModel = require('../models/User');
const jwt = require('jsonwebtoken');


module.exports = async function(req, res, next){
    if(!req.cookies.token){
        return res.redirect('/user/login');
    }


    
    try {
        let decoded = jwt.verify(req.cookies.token, process.env.JWT_SECRET_KEY);
        let user = await userModel.findOne({email: decoded.email}).select("-password");
        req.user = user;
        next();
    } catch (err) {
        console.log(err);
        
    }
}