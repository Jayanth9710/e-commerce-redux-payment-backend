'use strict'
const Product = require('../models/Product');
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const User = require('../models/user');

dotenv.config();

//Admin Registration and Login.//

// Registering Admin.
 const registerAdmin =  (req, res) => {
    const {name,username,email,password} =req.body;
      User.findOne({email:email})
    .then((savedAdmin)=>{
      if (savedAdmin) {
        res.status(403).json({
          message: "Admin is already registered.",
          
        });
      } else {
        // Hash the password
        let salt =  bcrypt.genSaltSync(10);
        let hash =  bcrypt.hashSync(password, salt);
        
  
        // Confirm registration.
        const newAdmin = new User({
          username:username,
          email:email,
          name:name,
          password:hash,
          role:'admin'
        })
  
        // Save user and send Response.
        newAdmin.save();
  
        res.json({
          message: "Admin registered successfully.",
        });
      }

    })
  .catch(err=>{
    console.log(err)
  })
}
  

// Login.

 const loginAdmin = async (req, res) => {
  try {
    let Admin = await User.findOne({ email: req.body.email });
    
    if (Admin) {
      let validPassword = bcrypt.compareSync(req.body.password, Admin.password);

      if (validPassword && Admin.role === 'admin') {
        // Generate JWT token
        let token = jwt.sign({ id: Admin._id }, process.env.JWT_SECRET);
        const { _id, name, email, username, role } = Admin;
        res.status(200).json({
          message: {_id, name, email, role, username},
          token,
        });
      } else {
        res.status(400).json({
            message: " Uh-oh...It seems you are not an admin."
        })
      }
    } else {
        res.status(403).json({
            message: "Admin is already registered.",
          });
    }
  } catch (error) {
    res.status(500).json(error);
  }
};

// Controller for multiple file upload //

const multipleFileUpload = async (req,res,next) => {
    try {
        let filesArray = [];
        req.files.forEach(e => {
            const file = {
                fileName:e.originalname,
                filePath:e.path,
                fileType:e.mimetype,
                fileSize:fileSizeFormatter(e.size,2)
            }
            filesArray.push(file);
        });
        const multipleFiles = new Product({
            productName: req.body.productName,
            description: req.body.description,
            countInStock: req.body.countInStock,
            price:req.body.price,
            files: filesArray
        });
        await multipleFiles.save();
        res.status(201).send('Files Uploaded Successfully');
    } catch (error) {
        res.status(400).send(error.message);
    }
}

const getallMultipleFiles =  async(req,res,next) => {
    try {
        const files = await  Product.find({userid : req.userid});
        res.status(200).send(files);
    } catch (error) {
        res.status(400).send(error.message);
    }
}

const fileSizeFormatter = (bytes,decimal) => {
    if(bytes ===0) {
        return '0 Bytes';
    }
    const dm = decimal || 2;
    const sizes = ['Bytes','KB','MB','GB','TB','PB','EB','YB','ZB'];
    const index = Math.floor(Math.log(bytes)/Math.log(1000));
    return parseFloat((bytes/Math.pow(1000,index)).toFixed(dm)) + ' ' + sizes[index];
}

module.exports = {
    multipleFileUpload,
    getallMultipleFiles,
    loginAdmin,
    registerAdmin
}

