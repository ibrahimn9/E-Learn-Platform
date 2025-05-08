const jwt = require('jsonwebtoken');
require('dotenv').config();

const verifyAuth = (req, res, next) => {
  // Get the token from the request cookies or headers
  const token = req.cookies.access_token;

  if (!token) {
    return res.status(401).json({ message: "Unauthorized: No token provided" });
  }

  // Verify the token
  jwt.verify(token, process.env.JWT_SECRET_KEY, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: "Unauthorized: Invalid token" });
    }

    // If token is valid, attach the decoded user data to the request object
    req.user = decoded;
    next(); // Pass the control to the next middleware
  });
};

module.exports = verifyAuth;
