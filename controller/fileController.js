const express = require("express");
const router = express.Router();
const mongoose = require("../config/mongoDbConnect");
const UploadedFile = require('../Model/uploadFileModel');
const flash = require("connect-flash");
const { v4: uuidv4 } = require('uuid');
const User = require('../Model/userModel');
const path = require("path");

exports.mainHome = (req, res) => {

    var errorMessage = req.flash("errorMessage");
    var successMessage = req.flash("successMessage"); 
    res.render("mainHome" , {
        errorMessage: errorMessage, 
        successMessage: successMessage
    });

};


exports.home = (req, res) => {
   
  var errorMessage = req.flash("errorMessage");
  var successMessage = req.flash("successMessage"); 
    res.render("home" , {
        errorMessage: errorMessage, 
        successMessage: successMessage
    }); 

};

exports.upload = async(req, res) => {
  
  var errorMessage = req.flash("errorMessage");
  var successMessage = req.flash("successMessage"); 
  let userUplodeadFiles = 0;

    res.render("upload" , {
        errorMessage: errorMessage, 
        successMessage: successMessage ,
        userUplodeadFiles: userUplodeadFiles 
    });

};

exports.download = (req, res) => {
    
  var errorMessage = req.flash("errorMessage");
  var successMessage = req.flash("successMessage"); 

    res.render("download", {
        errorMessage: errorMessage, 
        successMessage: successMessage
    });
};


exports.generatekey = async (req, res) => {

    var errorMessage = req.flash("errorMessage");
    var successMessage = req.flash("successMessage"); 
    const userId = req.session.user;
    const UploadedData = await UploadedFile.findOne({userId: userId});

    if(UploadedData){
        res.render("upload" , {
            errorMessage: errorMessage,  
            successMessage: successMessage ,
            keyId: UploadedData
        });
    }

   
};











exports.postRegister = async (req, res) => {
    const { email, password } = req.body;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
        req.flash("errorMessage", 'Please enter a valid email address');
        return res.redirect('/');
    }

    if (email.trim().length === 0) {
        req.flash("errorMessage", 'Email is required');
        return res.redirect('/');
    }

    if (password.trim().length === 0) {
        req.flash("errorMessage", 'Password is required');
        return res.redirect('/');
    }

    const user = await User.findOne({ email: email });

    if (user) {
        console.log("use 115r",user);
        req.session.user = user._id; 
        console.log("req.session.user 117" , req.session.user);
        req.flash("successMessage", 'Login successful');
        res.redirect('/home');
    } else {
        const newUser = new User({
            email: email,
            password: password
        });

        await newUser.save();
        req.session.user = newUser._id; 
        req.flash("successMessage", 'Registered successfully');
        res.redirect('/home');
    }
};







exports.postUpload = async (req, res) => {
    try {
        const { password } = req.body;
        let userUplodeadFiles = 0;
        const userId = req.session.user;
        console.log("userId 144",userId);

        if (password.trim().length === 0) {
            req.flash("errorMessage", 'Password is required');
            return res.redirect('/upload');
        }

        if (!req.files || Object.keys(req.files).length === 0) {
            req.flash("errorMessage", 'Please select a file');
            return res.redirect('/upload');
        }

        const files = req.files;
 
        const fileObjects = files.map(file => {
            return {
                originalname: file.originalname,
                mimetype: file.mimetype,
                filename: file.filename,
                size: file.size,
            };
        });

        const keyId = uuidv4();
        const newFile = new UploadedFile({
            userId: userId,
            password: password,
            keyId: keyId,
            files: fileObjects
        });

        await newFile.save();

        req.flash("successMessage", 'File uploaded successfully');
        res.render('upload', { 
            keyId: keyId, 
            password: password, 
            successMessage: req.flash("successMessage"),
            userUplodeadFiles: userUplodeadFiles, 
        });
    } catch (err) {
        console.error('Error saving file data:', err);
        res.status(500).send('Internal Server Error');
    }
};


exports.postDownload = async (req, res) => {

    const { keyId, password } = req.body; 
    
    if (keyId.trim().length === 0) {
        req.flash("errorMessage", 'Key ID is required');
        return res.redirect('/download');
    }

    if (password.trim().length === 0) {
        req.flash("errorMessage", 'Password is required');
        return res.redirect('/download');
    }
    
    const userId = req.session.user;

    const file = await UploadedFile.findOne({ userId: userId, keyId: keyId, password: password });

    if (!file) {
        req.flash("errorMessage", 'Invalid key ID or password');
        return res.redirect('/download');
    }

    const filePath = path.join(__dirname, '../uploads', file.files[0].filename);

    res.download(filePath);
    
}


exports.uploadedFiles = async (req, res) => {
    
    const userId = req.session.user;
    const userUplodeadFiles = await UploadedFile.find({ userId: userId });
    console.log("userUplodeadFiles 219",userUplodeadFiles);
    var errorMessage = req.flash("errorMessage");
    var successMessage = req.flash("successMessage");

    res.render("upload" , {
        errorMessage: errorMessage, 
        successMessage: successMessage , 
        userUplodeadFiles: userUplodeadFiles
    });
   
}