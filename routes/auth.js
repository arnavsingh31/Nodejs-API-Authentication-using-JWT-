const express = require('express');
const router = express.Router();
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const {registerValidation, loginValidation} = require('../validation');


router.post('/register', async (req, res)=>{
    const { error } = registerValidation(req.body);
    console.log(error);
    if (error){
        return res.status(400).send(error);
    };
    
    

    //email check!!! if it already exists in our db
    const emailCheck = await User.findOne({email: req.body.email});
    if(emailCheck){
        return res.status(400).send('Email already in use');
    }
    

    // hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    // create a new user   
    const user = new User({
        name: req.body.name,
        email: req.body.email,
        password: hashedPassword
    });
    // User.create(req.body).then((user)=>{
    //     res.send(user);
    // }).catch(next);
    try {
        const saveUser = await user.save();
        res.send({user: user._id});
    } catch (error) {
        res.status(400).send(error);
    } 
        
});

router.post('/login', async (req, res)=>{
    // login validation
    const {error} = loginValidation(req.body);
    if (error){
        return res.send(error.details[0].message).status(400);
    };
    // check if there is a user with given email 
    const user = await User.findOne({email: req.body.email});
    if(!user){
       return res.status(400).send('ivalid email or password');
    }
    // password check
    const checkPass = await bcrypt.compare(req.body.password, user.password)
    if (!checkPass){
        return res.status(400).send('invalid email or password');
    }

    // create and assign a token
    const token = jwt.sign({_id: user._id}, process.env.TOKEN_SECRET);
    res.header('auth-token', token)
    res.send(token);

})

module.exports = router;