const pool = require('../database');

async function getAllProducts() {

    try {
        // when we store data as decimal in MySQL
        // MySQl2 when fetching it will retrieve it as a string
        // so we have to convert it back to double with CAST
        const [rows] = await pool.query(`SELECT id, name, 
        CAST(price AS DOUBLE) as price, 
        image FROM products`);

        return rows;
    } catch (e) {
        console.log("Database error when getting all products");
        console.log(e);
        throw e; // <-- pass the error to the proceeding function to handle
    }
   


}

async function getProductById(id) {
    const [rows] = await pool.query(`SELECT * FROM products WHERE id = ?`, [id]);
    return rows[0]; // we only want the first result
}

// Similiar to:
// export const getAllProducts() {...}
// export const getProductById() {...}
module.exports = {
    getAllProducts,
    getProductById
}