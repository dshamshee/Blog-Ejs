const mongoose = require('mongoose');
require('dotenv').config();


mongoose
.connect(process.env.DB_CONNECTION)
.then(function () {
    console.log("Database Connected")
})
.catch(function (err) {
    console.log(err);
})


module.exports = mongoose.connection;