const orderData = require('../data/orderData');

async function getOrdersByUserId(userId) {
    return await orderData.getOrdersByUserId(userId);
}

async function createOrder(userId, orderItems ) {
    return await orderData.createOrder(userId, orderItems);
}

async function updateOrderSessionId(orderId, sessionId) {
    // TODO: The order is ready and we can probably prepare the invoice
    return await orderData.updateOrderSessionId(orderId, sessionId);
}

async function getOrderDetails(orderId) {
    return await orderData.getOrderDetails(orderId);
}

async function updateOrderStatus(orderId, status) {
    // TODO: if order status is changed to "completed" then inform the shipping system
    return await orderData.updateOrderStatus(orderId, status);
}

module.exports = {
    getOrdersByUserId,
    createOrder,
    getOrderDetails,
    updateOrderStatus,
    updateOrderSessionId
};