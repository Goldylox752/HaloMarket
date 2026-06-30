// ============================================
// JWT Utilities
// ============================================

const jwt = require("jsonwebtoken");

// Create Access Token
const generateAccessToken = (user) => {

    return jwt.sign(
        {
            id: user.id,
            role: user.role,
            email: user.email
        },
        process.env.JWT_SECRET,
        {
            expiresIn: "7d"
        }
    );

};

// Verify Token
const verifyToken = (token) => {

    return jwt.verify(token, process.env.JWT_SECRET);

};

module.exports = {
    generateAccessToken,
    verifyToken
};
