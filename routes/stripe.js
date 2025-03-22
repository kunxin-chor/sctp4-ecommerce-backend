const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const express = require('express');
const router = express.Router();
const orderService = require('../services/orderService')

// Stripe will be sending hashed data, for this route we cannot use express.json
// to process the payload

router.post('/webhook', 
    express.raw({
        type:"application/json"
    }),
    async (req,res) => {
        let event = null;
        try {
            // verify the stripe signature and get the request payload
            // as this should be sent from Stripe BUT we need to verify
            const sig = req.headers['stripe-signature'];
            event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_ENDPOINT_SECRET)


        } catch (e) {
            console.error(e);
            return res.status(400)
                      .send("Webhook error: ", e.message);
        }



        console.log(event);
        if (event.type == 'checkout.session.completed') {
            // process the checkout is successful event
            const session = event.data.object;
            if (session.metadata && session.metadata.orderId && session.metadata.userId) {
                await orderService.updateOrderStatus(session.metadata.orderId, "processing");
            }
            console.log(session.metadata);
        }


        res.sendStatus(200); // inform stripe that we have successful process the event
    }
)

module.exports = router;