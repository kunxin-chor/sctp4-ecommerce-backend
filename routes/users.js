const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');

const userService = require('../services/userService');


router.post('/register', async (req, res) => {
    try {
        const result = await userService.registerUser(
            req.body.name,
            req.body.email,
            req.body.password,
            req.body.salutation,
            req.body.country,
            req.body.marketingPreferences
        );

        res.json({
            'message': 'User has been created successful',
            'result': result
        })

    } catch (e) {
        console.log(e);
        res.status(500).json({
            'message': 'Error registering a user'
        })
    }

})

router.post('/login', async (req, res) => {
    const user = await userService.loginUser(req.body.email, req.body.password);
    
    // the first parameter of jwt.sign is the payload or 'claims'
    // the second parameter is the JWT_SECRET
    // the third parameter is the options
    const token = jwt.sign({  
        'userId': user.id  
    }, process.env.JWT_SECRET, {
        expiresIn:'1h'
    })
    res.json({
        'message': 'Login successful!',
        'user': user,
        'token': token
    })
})

router.put('/me', (req, res) => {
    res.json(
        {
            'message': 'Update user'
        }
    )
})

router.delete('/:id', (req, res) => {
    res.json({
        'message': 'delete yser'
    }
    )
})

module.exports = router;