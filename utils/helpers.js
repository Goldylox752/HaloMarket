// ==========================================
// Common Helpers
// ==========================================

exports.capitalize = (str = "") => {

    return str.charAt(0).toUpperCase() +

        str.slice(1);

};

exports.randomString = (length = 12) => {

    const chars =

        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    let result = "";

    for (let i = 0; i < length; i++) {

        result += chars.charAt(

            Math.floor(Math.random() * chars.length)

        );

    }

    return result;

};

exports.sleep = ms =>

    new Promise(resolve => setTimeout(resolve, ms));
