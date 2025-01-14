const mongoose = require('mongoose');

mongoose
.connect("mongodb://127.0.0.1:27017/blog-platform")
.then(function () {
    console.log("Database Connected")
})
.catch(function (err) {
    console.log(err);
})


module.exports = mongoose.connection;