const jwt = require('jsonwebtoken');


// A middleware is a function that takes in three
// argument: req, res, next
// req: request
// res: respond
// next: is the next middleware in the chain
// or the route itself (MAKE SURE TO CALL NEXT() in your middleware function)
// pattern: chain of responsbility
function AuthenticateWithJWT(req, res, next) {

    // 1. get the JWT token from the headers
    const authHeader = req.headers.authorization;


    // 2. check if the auth header exist
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.sendStatus(401);
    }

    // authHeader, if it exists, should be "Bearer <JWT>"
    // "Bearer <JWT>".split(' ') => ['Bearer', '<JWT>'];

    // 3. extract out the token
    const token = authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({
            'message': 'JWT is not found'
        })
    }

    // 4. check if the token is valid
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        // save the user id to the req
        req.userId = decoded.userId;

        // call the next middleware in the chain
        // if no middeware left in the chain, then it will be route function
        // if token is valid, then we send the request to the next middleware
        next();

    } catch (e) {

        console.log(e);
         // if not token is not valid, send back an error
        res.status(403).json({
            'message':'Invalid JWT or expired'
        })
    }



   

}

module.exports = AuthenticateWithJWT;