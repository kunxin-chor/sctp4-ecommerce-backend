const userData = require('../data/userData');
const bcrypt = require('bcrypt');

async function registerUser(name, email, password, salutation, country, marketingPreferences) {
    // valdation in the service layer vs. validation in the data layer
    // service layer - make sure it follows business rule
    if (password.length < 8) {
        throw new Error("Password must be at least 8 characters");
    }

    // email are not repeated
    const user = await userData.getUserByEmail(email);

    if (user) {
        throw new Error("Email is already in use")
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    return await userData.createUser(name, email, hashedPassword, salutation, country, marketingPreferences);
}

async function loginUser(email, password) {
    // get the user by email
    const user = await userData.getUserByEmail(email);
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
        throw new Error("Invalid email or password")
    }
    return user;

}

async function getUserDetailsById(userId) {
    // todo: business rules
    // - legal (like age)
    // - security (redact)
    // - marketing 
    const user = await userData.getUserById(userId);
    return {
        name: user.name,
        email: user.email,
        salutation: user.salutation ,
        id: user.id
    };
}

async function updateUserDetails(id, userDetails) {
    return await userData.updateUser(id,
        userDetails.name,
        userDetails.email,
        userDetails.salutation,
        userDetails.country,
        userDetails.marketingPreferences

    )
}

async function deleteUser(id) {
    return await userData.deleteUser(id);
}

module.exports = {
    registerUser, 
    loginUser, 
    getUserDetailsById,
    updateUserDetails,
    deleteUser
}