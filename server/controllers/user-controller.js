// imports
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');

const HttpError = require('../models/http-error');
const User = require('../models/user');


const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'nodemailertest02@gmail.com',
        pass: '!newpassword'
    }
});
// get users
const getUsers = async (req, res, next) => {
    let users;

    try{
        users = await User.find({}, '-password');
    } catch (e){
        const error = new HttpError('Cannot find user', 422);
        return next(error);
    }

    // send response by mapping users and generate new id
    res.json({users : users.map( user => user.toObject({getters: true }) )});
};

// create user
const signUp = async (req, res, next) => {
    const {email, password, active, firstName, lastName, company, role} = req.body;

    // check if user already exists
    let existingUser;
    try{
        existingUser = await User.findOne({ email });
    } catch (e){
        const error = new HttpError('Signup up failed, please try again later', 422);
        return next(error);
    }

    if (existingUser){
        const error = new HttpError('User already exists, please login instead', 422);
        return next(error);
    }

    // hash password
    let hashedPassword;
    try{
        hashedPassword = await bcrypt.hash(password, 12);
    } catch (e){
        const error = new HttpError('Could not crate user, please try again', 422);
        return next(error);
    }

    // create new user
    const createdUser = new User({
        email,
        password: hashedPassword,
        active: active || false,
        firstName,
        lastName,
        company,
        role
    })

    // save new user
    try {
        await createdUser.save();
    } catch (e){
        const error = new HttpError('Signing up failed, please try again.', 422);
        return next(error);
    }

    // check if account is activated

    const url = 'http://localhost:3000/activate/';

    // mail options
    var mailOptions = {
        from: 'no-replay@website.com',
        to: email,
        subject: 'Activate account',
        text: `Hello, please activate your account here: ${url}`
    };

    // send mail if account is not activated
    transporter.sendMail(mailOptions, function(error, info){
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });


    // generate token
    let token;
    try {
        token = jwt.sign({
            userID: createdUser.id,
            email: createdUser.email
        }, 'supersecret_dont_share', {expiresIn: '1h'});
    } catch (e) {
        const error = new HttpError('Signing up failed, please try again.', 422);
        return next(error);
    }

    // send response
    res.status(200).json({user: createdUser.id, email: createdUser.email, active, token , mailOptions, mailTOSendEmail: email});
}

// short check if user already exists
const userExists = async (req, res, next) => {
    const {email} = req.body;

    let existingUser;
    try{
        existingUser = await User.findOne({ email });
    } catch (e){
        const error = new HttpError('Cannot find user', 422);
        return next(error);
    }

    res.status(200).json({email: !!existingUser});
}

// activate account
const activateAccount = async (req, res, next) => {
    const userId = req.params.uid;

    let user;
    // search user by id
    try {
        user = await User.findById(userId, '-password');
    } catch (err) {
        const error = new HttpError('Something went wrong, could not activate user.', 403);
        return next(error);
    }

    user.active = true;

    try {
        await user.save();
    } catch (err) {
        const error = new HttpError('Something went wrong, could not activate user.', 403);
        return next(error);
    }

    res.status(200).json({ user: user.toObject({ getters: true }) });

}

// login
const login = async (req, res, next) => {
    const {email, password} = req.body;

    // check if user exist
    let existingUser;
    try{
        existingUser = await User.findOne({email});
    } catch (e){
        const error = new HttpError('Signup in failed, please try again later', 422);
        return next(error);
    }

    // if the user tries to log in without activate the account
    if (!existingUser.active) {
        console.log('here')

        const error = new HttpError('Signup in failed, please try again later', 422);
        return next(error);
    }

    // if there's no user
    if(!existingUser){
        const error = new HttpError('Invalid credentials, could not log you in', 403);
        return next(error);
    }

    // check password
    let isValidPassword = false;
    try{
        isValidPassword = await bcrypt.compare(password, existingUser.password);
    } catch (e){
        const error = new HttpError('Could not log you in, please check your credentials and try again', 403);
        return next(error);
    }

    // password doesnt match
    if(!isValidPassword){
        const error = new HttpError('Invalid credentials, could not log you in', 403);

        return next(error);
    }

    // token
    let token;
    try{
        token = jwt.sign({
            userId: existingUser.id,
            email: existingUser.email
        }, 'supersecret_dont_share', {expiresIn: '1h'});
    } catch (e){
        const error = new HttpError('Loggin in failed, please try again.', 422);
        return next(error);
    }

    // send response
    res.status(200).json({
        userId: existingUser.id,
        email: existingUser.email,
        token,
        lastName: existingUser.lastName,
        firstName: existingUser.firstName,
        role: existingUser.role
    });
};

// export
exports.getUsers = getUsers;
exports.userExists = userExists;
exports.signUp = signUp;
exports.activateAccount = activateAccount;
exports.login = login;