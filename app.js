const express = require('express');
const engine = require('ejs-mate');
const app = express();
const db = require('./config/DB_Connection');
const cookieParser = require('cookie-parser');
const path = require('path');
const userModel = require('./models/User');
const postModel = require('./models/Post');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const upload = require('./config/multer-config');
const userRouter = require('./routes/users');
const postRouter = require('./routes/posts');
const indexRouter = require('./routes/index');
// some middlewares



app.engine('ejs', engine);
app.use(express.json());
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.use(cookieParser());


app.use('/', indexRouter);
app.use('/user', userRouter);
app.use('/post', postRouter);




app.listen(3000);