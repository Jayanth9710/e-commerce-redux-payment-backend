'use strict'
const express = require('express');
const router = express.Router();
const {upload} = require('../Helpers/Helper');
const {getAllProducts,getProductById} = require('../Controllers/productControllers')
const {multipleFileUpload,getallMultipleFiles,loginAdmin, registerAdmin} =require('../Controllers/Admin')
const {authenticate} = require('../Middleware/Authenticate')



router.get('/products',getAllProducts)
router.get('/product/:id',getProductById)
router.post('/addproduct',upload.array('files'),multipleFileUpload)
router.get('/admin/products',[authenticate],getallMultipleFiles)
router.post('/admin/register',registerAdmin)
router.post('/admin/login',loginAdmin)


module.exports = router; 