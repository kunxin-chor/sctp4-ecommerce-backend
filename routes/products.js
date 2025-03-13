// all CRUD routes pertaining to
// products will be placed in this file
const express = require('express');
const router = express.Router(); // create a new router
const productService = require('../services/productService');

// GET all the products
router.get('/', async (req,res)=>{
    try {
        const products = await productService.getAllProducts();
        res.json(products)
    } catch (e) {
        console.log(e);
        res.status(500).json({
            'error':'Error retriving all products'
        })
    }
  
})

// GET a single product by its id
router.get('/:id', async  (req,res)=>{
    try {
        const product = await productService.getProductById(req.params.id);
        res.json({
            'product': product
        })
    } catch (e) {
        console.log(e);
        res.status(500).json({
            'error': 'Error retriving product by id'
        })
    }
   
})

// export router so index.js can use it
module.exports = router;