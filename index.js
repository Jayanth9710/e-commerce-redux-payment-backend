const express = require('express');
const app = express();
const mongoose = require('mongoose');
const dotenv = require("dotenv")
const Razorpay = require('razorpay')
const shortid = require('shortid')
const PORT = process.env.PORT || 4000;
const path =require('path');
const router =require("./Routes/productRoutes");
const userRouter = require("./Routes/userRoutes")
const methodOverride = require('method-override')
const cors = require('cors')
dotenv.config();
const url = process.env.MONGO_URI;

require('./models/user')

const corsOptions ={
    origin:'*', 
    credentials:true,            //access-control-allow-credentials:true
    optionSuccessStatus:200
}
app.use(cors(corsOptions));

const razorpay = new Razorpay({
    key_id: process.env.RAZOR_PAY_KEY_ID,
    key_secret: process.env.RAZOR_PAY_KEY_SECRET,
  });

app.use(express.json());
app.use(express.urlencoded({
    extended: true
  }));
app.use("/",userRouter)
app.use("/api",router);
app.use('/uploads',express.static(path.join(__dirname,'uploads')));

app.post('/verification',(req,res) => {
    //Validation
const secret = process.env.RAZOR_PAY_VERIFICATION_SECRET
console.log(req.body)
const crypto = require('crypto')

	const shasum = crypto.createHmac('sha256', secret)
	shasum.update(JSON.stringify(req.body))
	const digest = shasum.digest('hex')

	console.log(digest, req.headers['x-razorpay-signature'])

	if (digest === req.headers['x-razorpay-signature']) {
		console.log('request is legit')
		// process it
		
	} else {
		// pass it
	}

    res.json({status:'Okay'})
})

app.post('/cart', async (req,res) => {
    const payment_capture = 1
    const amount = parseInt(req.body.total),
    currency = 'INR'
    const options = {
        amount: Number(amount *100),
        currency,
        receipt:shortid.generate(),
        payment_capture
      }

try {
    const response = await razorpay.orders.create(options)
    console.log(response)
    res.json({
        id: response.id,
        currency: response.currency,
        amount: response.amount
    })
} catch (error) {
    console.log(error)
}
    
} )

app.use(methodOverride('_method'))

mongoose.connect(url);

mongoose.connection.on('connected',() => {
    console.log('Connected to MongoDB')
})
mongoose.connection.on('error',(err) => {
    console.log('Error connecting to MongoDB',err)
})

app.listen(PORT, function() {
    console.log(`The app is running on PORT ${PORT}`);
})