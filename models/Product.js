const mongoose = require('mongoose');


const Schema = mongoose.Schema;

const productSchema= new Schema({

    productName:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    price:{
        type:Number,
        required:true
    },
    countInStock:{
        type:Number,
        required:true
    },
    files:[Object]
});

const Product = mongoose.model('product', productSchema) 

module.exports = Product;