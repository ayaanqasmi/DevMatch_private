import expressAsyncHandler from "express-async-handler";
import jwt from "jsonwebtoken";

// Middleware to validate token
const validateTokenHandler = expressAsyncHandler(async (req, res, next) => {

    let userToken;
    let authHeader = req.headers.authorization; // Get authorization header from request
    
    // Split the authorization header to extract the token
    authHeader = authHeader.split(" "); 
    
    // Check if the header exists and starts with "Bearer"
    if (authHeader && authHeader[0] === "Bearer") {
        userToken = authHeader[1]; // Extract token from header
        
        // Verify the token using the secret
        jwt.verify(userToken, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
            if (err) {
                console.log(decoded); // Log decoded data (optional)
                console.log(err); // Log the error for debugging
                res.status(401); // Unauthorized status code
                throw new Error("unauthorized1"); // Throw error if token is invalid
            }
            console.log(decoded); // Log decoded user info (optional)
            req.user = decoded.user; // Attach decoded user data to request object
            next(); // Proceed to the next middleware or route handler
        });
        
        // Check if userToken is missing
        if (!userToken) {
            res.status(401); // Unauthorized status code
            throw new Error("unauthorized2"); // Throw error if no token is provided
        }
    } else {
        // Handle case where the header is missing or incorrect
        res.status(401); // Unauthorized status code
        throw new Error("unauthorized3"); // Throw error if authorization header is not in the expected format
    }
});

export default validateTokenHandler; // Export the middleware
