const { promisify } = require('util');
const User = require('../models/userModel');
const catchAsync = require('./../utils/catchAsync');
const jwt = require("jsonwebtoken");
const AppError = require('../utils/appError');


const signToken = id => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN,
    })
}

exports.signup = catchAsync(async (req, res, next) => {
    const newUser = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        passwordConfirm: req.body.passwordConfirm
    });

    const token = signToken(newUser._id)
    // const token = jwt.sign({ id:newUser._id }, process.env.JWT_SECRET, {
    //     expiresIn: process.env.JWT_EXPIRES_IN,
    // })

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
    // const correct = await user.correctPassword(password, user.password)
    if(!user || !(await user.correctPassword(password, user.password))){
        return next(new AppError('Wrong email or password', 401));
    }

    // console.log(user._id)
    const token = signToken(user._id)
    res.status(200).json({
        status: 'success',
        token
    })
})

exports.protect = catchAsync(async (req, res, next) => {
    let token;
    if(req.headers.authorization && req.headers.authorization.startsWith('bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }
    if(!token) {
        return next(new AppError('You are logged in! Please log in to get access.', 401));
    }
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

    const freshUser = await User.findById(decoded.id)
    if(!freshUser) {
        return next(
            new AppError(
                'The user belonging to this token does no longer exist',
                401
            )
        )
    }
    // if(freshUser.changesPasswordAfter(decoded.iat)){
    //     return next(
    //         new AppError(
    //             'User recently changed password! Please log in again.',401
    //         )
    //     )
    // }
    // req.user=freshUser;

    next()
})

