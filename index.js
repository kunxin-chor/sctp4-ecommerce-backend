const express = require('express');
const cors = require('cors');
require('dotenv').config();

// router files
const productsRouter = require('./routes/products.js')
const userRouter = require('./routes/users');

const app = express();

// middlewares
app.use(express.json());
// if off, a frontend must be on the same domain to access your api
// backend is hosted on example.com
// then frotend is hosted on xyz.example.com to access or example.com/xyz.html
app.use(cors()); // enable cross origins resources sharing (--> only works for websites)

app.get("/", (req,res)=>{
    res.json({
        "message":"Welcomem to the API"
    })
})

// Register the product routers
// if a request which URL begins with '/api/products',
// the remainder of the URL will be sent to productsRouter
app.use('/api/products', productsRouter)
app.use('/api/users', userRouter);

// we can specify the PORT in the .env file
// PORT => virtual port, usually meant for networking
// IP Address => identifies a computer on the network
// PORT => identifies which PROGRAM (aka process) is reciving or sending data
const PORT = process.env.PORT || 3000; // default port is 3000
// when we do deployment, we need to set the PORT to 80 or 443
// OR different hosting services might have different requirements for PORTS
app.listen(PORT, () =>{
    console.log("Server is running at PORT " + PORT )
})