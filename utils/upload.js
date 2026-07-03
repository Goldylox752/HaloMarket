// ==========================================
// Upload Utility
// ==========================================

const path = require("path");

exports.allowedImages = [

    ".jpg",

    ".jpeg",

    ".png",

    ".webp"

];

exports.isImage = filename => {

    return exports.allowedImages.includes(

        path.extname(filename).toLowerCase()

    );

};

exports.maxFileSize = 5 * 1024 * 1024;
