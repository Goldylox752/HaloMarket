// ==========================================
// Crypto Utility
// ==========================================

const crypto = require("crypto");

exports.randomToken = (length = 32) => {

    return crypto

        .randomBytes(length)

        .toString("hex");

};

exports.sha256 = value => {

    return crypto

        .createHash("sha256")

        .update(value)

        .digest("hex");

};
