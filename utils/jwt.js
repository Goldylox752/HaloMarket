// ==========================================
// HALO MARKETPLACE
// JWT Utility
// utils/jwt.js
// ==========================================

const jwt = require("jsonwebtoken");

// ==========================================
// CREATE ACCESS TOKEN
// ==========================================

function signAccessToken(user) {

    return jwt.sign(

        {
            id: user.id,
            email: user.email,
            role: user.role
        },

        process.env.JWT_SECRET,

        {
            expiresIn: process.env.JWT_EXPIRES || "7d"
        }

    );

}

// ==========================================
// CREATE REFRESH TOKEN
// ==========================================

function signRefreshToken(user) {

    return jwt.sign(

        {
            id: user.id
        },

        process.env.JWT_REFRESH_SECRET,

        {
            expiresIn: process.env.JWT_REFRESH_EXPIRES || "30d"
        }

    );

}

// ==========================================
// VERIFY TOKEN
// ==========================================

function verify(token) {

    return jwt.verify(

        token,

        process.env.JWT_SECRET

    );

}

module.exports = {

    signAccessToken,

    signRefreshToken,

    verify

};
