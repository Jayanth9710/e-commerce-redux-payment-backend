const express = require('express');
const userRouter = express.Router();
const {authenticate} = require('../Middleware/Authenticate')

const {registerUser,loginUser,getUserAdrs} =require('../Controllers/users');

userRouter.post('/register',registerUser)
userRouter.post('/login',loginUser)
userRouter.get('/address/:user',getUserAdrs)

module.exports = userRouter
