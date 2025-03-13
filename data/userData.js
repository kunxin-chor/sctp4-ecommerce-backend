const pool = require('../database');

async function getUserByEmail(email) {
    if (!email || typeof email !== 'string') {
      throw new Error('Invalid email');
    }
    const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
    return rows[0];
  }

async function createUser(name, email, password, salutation, country, marketingPreferences) {
    // validate to make that name, email and password
    if (!name || !email || !password || name.length > 100) {
        throw new Error("Invalid name, email or password");
    }
    const connection = await pool.getConnection();
    try {
        // begin a transaction: telling the database what happens next to the database (esp. updates and insert and deletes)
        // are considered to be part of the same operation
        await connection.beginTransaction();

        // insert the user data
        const [userResult] = await connection.query(`
            INSERT INTO users (name, email, password, salutation, country)
             VALUES (?, ?, ?, ?, ?)
            `, [name, email, password, salutation, country]);

        // the id of the new user
        const userId = userResult.insertId; // <-- get the primary key from a new row

        // check if marketing preferences is an array
        // marketing preferences should the name of the preference
        // eg. ['email'] OR ['email', 'sms']
        if (Array.isArray(marketingPreferences)) {
            for (let m of marketingPreferences) {
                // assume m is either 'sms' or 'email'
                // then we find the corresponding id
                const [preferenceResult] = await connection.query(`
                    SELECT id FROM marketing_preferences WHERE preference = ?
                    `, [m]);
                    
                const preferenceId = preferenceResult[0].id;

                await connection.query(`
                    INSERT INTO user_marketing_preferences (user_id, preference_id)
                       VALUES (?, ?)
                    `, [userId, preferenceId]);

                    
            }
        }
        await connection.commit(); // all changes made to the database at this point is now permanent

    } catch (e) {
        await connection.rollback(); // undo changes since the start of beginning a new transactions
        console.log(e);
        throw e; // throw the error to the service layer to handle
    } finally {
        // at the end of a try ... catch
        // all the code in finally will run
        // even if there is error
        // usually finally is used for clean up
        connection.close();
    }
}



module.exports = {
    createUser,
    getUserByEmail
}