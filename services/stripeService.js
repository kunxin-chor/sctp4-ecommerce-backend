// initialise stripe
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

async function createCheckoutSession(userId, orderItems, orderId) {
    const lineItems = createLineItems(orderItems);
    console.log("lineItems =>", lineItems);
    // 2nd parameter of stripe.checkout.sessions.create is the configuration of checkout
    const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'], 
        line_items: lineItems,
        mode: 'payment',
        success_url: "https://www.google.com",
        cancel_url:"https://www.yahoo.com",
        // store customized data which stripe doesn't provide for in metadata
        metadata: {
            userId: userId,
            orderId: orderId
        }
    });

    // this is the session data that we will send to the user
    // and the user can use this to make payment at Stripe
    return session;
}

function createLineItems(orderItems) {
 
    const lineItems =  [];
    for (let item of orderItems) {
        // structure of a line item in Stripe
        const lineItem = {
            'price_data':{
                'currency':'sgd',
                'product_data':{
                    'name': item.productName,
                    'images': [item.imageUrl || 'https://placehold.co/400'],
                    'metadata':{
                        'product_id': item.product_id
                    }
                },
                // is in cents and must be integer
                'unit_amount': Math.round(item.price * 100)
            },
            'quantity': item.quantity
        }
        lineItems.push(lineItem);
    }

    return lineItems;
}

module.exports = {
    createCheckoutSession,
    createLineItems
}