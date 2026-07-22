const express = require('express');
const userRouter = express.Router();
const { login, logout, sing_up, getScorer } = require('../controller/Auth');

userRouter.post('/login', login);
userRouter.post('/signup', sing_up);
userRouter.post('/logout', logout);
userRouter.get('/scorer', getScorer);


module.exports = userRouter; 