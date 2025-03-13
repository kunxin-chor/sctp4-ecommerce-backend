const productData = require('../data/productData')

async function getAllProducts() {
    return await productData.getAllProducts();
}

async function getProductById(id) {
    // TODO: note the user's interest in this product
    return await productData.getProductById(id);
}

module.exports = {
    getAllProducts,
    getProductById
}