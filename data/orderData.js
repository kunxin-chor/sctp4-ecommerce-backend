const pool = require('../database');

async function getOrdersByUserId(userId) {
    const [rows] = await pool.query('SELECT * FROM orders WHERE user_id = ?', [userId]);
    return rows;
}

// orderItems is an array of objects
// Each order item is an object with the following keys
// - product_id : which product it is for
// - quantity: how many to buy
async function createOrder(userId, orderItems) {
    const connection = await pool.getConnection();
    try {
        
        await connection.beginTransaction();

        // calculate the total of the order
        let total = 0;
        for (let o of orderItems) {
            total += o.price * o.quantity;
        }

        // create the order row in the orders table
        const [orderResult] = await connection.query(`INSERT INTO orders (user_id, total)
                VALUES (?, ?)
            `, [userId, total]);

        // get the ID of the last created order
        const orderId = orderResult.insertId; // --> insertId is the ID of the new row
        for (const item of orderItems) {
            await connection.query(
                `INSERT INTO order_items (order_id, product_id, quantity) VALUES(?, ?, ?)`,
                [orderId, item.product_id, item.quantity]
            )
        }

        // make all changes to the database so far permanent
        await connection.commit();
        return orderId;

    } catch (e) {
        await connection.rollback();
        throw (e);
    } finally {
        await connection.release();
    }
}

async function getOrderDetails(orderId) {
    const [rows] = await pool.query(`
        SELECT
            oi.product_id,
            p.name,
            p.price,
            oi.quantity
        FROM order_items oi
        JOIN products p ON oi.product_id = p.id
        WHERE oi.order_id = ?
    `, [orderId]);

    return rows;
}

async function updateOrderStatus(orderId, status) {

    // validate status before updatingOr
    if (!['pending', 'created', 'processing', 'completed', 'cancelled'].includes(status)) {
        throw new Error('Invalid status');
    }

    await pool.query(`UPDATE orders SET status = ? WHERE id = ?`, [status, orderId]);
}

async function updateOrderSessionId(orderId, sessionId) {
    await pool.query(
        `UPDATE orders SET checkout_session_id = ? WHERE id = ?`, [sessionId, orderId]
    )
}


module.exports = {
    getOrdersByUserId,
    createOrder,
    getOrderDetails,
    updateOrderStatus,
    updateOrderSessionId
}