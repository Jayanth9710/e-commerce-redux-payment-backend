
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const mongodb = require ("mongodb");
const User = require('../models/user');
const mongoClient = mongodb.MongoClient;

dotenv.config();
const url = process.env.MONGO_URI;

// // Registering Users.
//  const registerUser =  (req, res) => {
//     const {name,username,email,password,shipAdd,crrAdd} =req.body;
//       User.findOne({email:email})
//     .then((savedUser)=>{
//       if (savedUser) {
//         res.status(403).json({
//           message: "Email is already registered.",
          
//         });
//       } else {
//         // Hash the password
//         let salt =  bcrypt.genSaltSync(10);
//         let hash =  bcrypt.hashSync(password, salt);
        
  
//         // Confirm registration.
//         const newUser = new User({ 
//           username:username,
//           email:email,
//           name:name,
//           shippingAddress:shipAdd,
//           currentAddress:crrAdd,
//           password:hash
//         })
  
//         // Save user and send Response.
//           newUser.save();
  
//         res.json({
//           message: "User registered successfully.",
//         });
//       }

//     })
//   .catch(err=>{
//     console.log(err)
//   })
// }
  

// // Login.

//  const loginUser = async (req, res) => {
//   try {
//     let user = await User.findOne({ email: req.body.email });

//     if (user) {
//       let validPassword = bcrypt.compareSync(req.body.password, user.password);
//       if (validPassword) {
//         // Generate JWT token
//         let token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
//         res.json({
//           message: user._id,
//           token,
//         });
//       } else {
//         res.status(403).json({
//             message: "Username/Password is incorrect"
//         })
//       }
//     } else {
//         res.status(403).json({
//             message: "Email is already registered.",
//           });
//     }
//   } catch (error) {
//     res.status(500).json(error);
//   }
// };

//--------------------------- Get User Address---------//

const getUserAdrs = async (req,res) => {
  try {
    let userData = await User.findOne({_id: req.params.user})
    console.log("-------------")
console.log(req.params.user)
    res.json(userData)
    
  } catch (error) {
    console.log(error)
    res.status(500).json({
      message:'Something went wrong.'
    })
  }
}

//--------------------------- Edit/Add user Address---------//

const editUserAddress = async (req,res) => {
  try {
    const { id: _id } = req.body.userid;
    let data = await User.findOne({_id:mongodb.ObjectId(req.body.userid)});
    data.shippingAddress = req.body.shipAdd

    const editPost = await User.findByIdAndUpdate(_id, data, {
      new: true,
    });
    console.log("edited")
    res.status(200).json(editPost);
  } catch (error) {
    console.log(error)
     res.status(400).json({message:'Bad Request'})
  }
}


// Fetching all products.

// export const getProducts = async (req,res) => {
//     try {
//         // Connecting to DB.
//     let client = await mongoClient.connect(URI);

//     //Select the DB.
//     let db = client.db("ecommerce");

//     //Select the collection and perform action.
//     let data = await db.collection("products").find().toArray();

//     // Close the DB Connection.
//     await client.close();

//     } catch (error) {
//             res.status(500).json(error);
//     }
// }

//Adding products to cart.

// export const addToCart = async (req,res) => {
//     try {
        
//             // Connecting to DB.
//         let client = await mongoClient.connect(URI);
    
//         //Select the DB.
//         let db = client.db("ecommerce");
        
//         //Select the collection and perform action.
//         let data = await db.collection("cart").find({$and:[{cartid: mongodb.ObjectId(req.body.values)},{userid:req.body.userid}]}).toArray();
        
//     } catch (error) {
        
//     }
// }

//------------Registering Users---------//

const registerUser = async (req,res) => {
  req.body.role="user";
  try {
      // Connecting to DB
      let client = await mongoClient.connect(url);

      //Select the DB
let db = client.db("ecommerce");
let emailCheck = await db.collection("users").findOne({ email : req.body.email });

if (!emailCheck) {
  // Hashing the Password 
  let salt = bcrypt.genSaltSync(10);
  let hash = bcrypt.hashSync(req.body.password,salt);

  req.body.password = hash;

  //Posting the User details to DB

  let data = await db.collection('users').insertOne(req.body);

  //Closing the connection to DB
  await client.close();

  res.json({
      message:"User Registered Successfully"
  });
} else {
  // Case when email is already present in DB.
  res.status(400).json({
      message:"E-mail is already registered.Please try with different e-mail ID."
  });
}
  } catch (error) {
      console.log(error);
      res.status(500).json({
          message:"Registration Failed due to some reason or Myabe check your connection."
      })
  }
}

//-------------User Login----------------//

const loginUser = async (req,res) => {
  try {
      // Connecting to DB
      let client = await mongoClient.connect(url);

      // Selecting the DB
      let db = client.db("ecommerce");

      //Finding the user details in DB

      let user = await db.collection("users").findOne({ email : req.body.email });

      if (user) {
          let validPassword = bcrypt.compareSync(req.body.password,user.password);

          if(validPassword) {
              let token = jwt.sign({ id : user._id},process.env.JWT_SECRET);
          res.json({
              message:true,
              token,
              user:user._id
          });
          } else {
              res.status(500).json({
                  message:"Username/Password is incorrect",
              });
          }
      } else {
          res.status(500).json({
              message:"Username/Password is incorrect",
          });
      }
  } catch (error) {
      console.log(error)
      res.status(500).json({
          message:"Sign in failed due to some reason or maybe check your connection."
      })
  }
}

module.exports ={
  registerUser,
  loginUser,
  getUserAdrs,
  editUserAddress
} 
