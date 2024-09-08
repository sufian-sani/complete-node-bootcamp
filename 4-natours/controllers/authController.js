const User = require('../models/userModel');
const catchAsync = require('./../utils/catchAsync');
const jwt = require("jsonwebtoken");
const AppError = require('../utils/appError');

exports.signup = catchAsync(async (req, res, next) => {
    const newUser = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        passwordConfirm: req.body.passwordConfirm
    });

    const token = jwt.sign({ id:newUser._id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN,
    })

    // createSendToken(newUser, 201, res);
    res.status(200).json({
        success: 'success',
        token,
        data: {
            user: newUser
        }
    });
});

exports.signin = catchAsync(async (req, res, next) => {
    const {email, password} = req.body;
    if (!email || !password) {
        return next(new AppError('please provide email and password', 400))
    }
    const user = await User.findOne({ email }).select('+password')
    const correct = await user.correctPassword(password, user.password)
    console.log(correct)

    const token = ''
    res.status(200).json({
        status: 'success',
        token
    })
})