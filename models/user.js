const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    username:{
        type:String,
        min:3,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    role: {
        type:String,
        enum:['user', 'admin'],
        default:'user'
    },
    currentAddress:{
        type:String,
        min:5
    },
    shippingAddress:{
        type:String,
        min:5
    }
})

const User = mongoose.model("User",userSchema);

module.exports = User;