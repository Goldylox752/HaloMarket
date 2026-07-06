// ========================================
// Halo Marketplace
// middleware/validators.js
// Request Validation Middleware
// ========================================

const { body, param, validationResult } = require("express-validator");

// ========================================
// Handle Validation Errors
// ========================================

const validate = (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            message: "Validation failed.",
            errors: errors.array()
        });
    }

    next();
};

// ========================================
// User Registration
// ========================================

const registerValidation = [

    body("firstName")
        .trim()
        .notEmpty()
        .withMessage("First name is required.")
        .isLength({ min: 2, max: 30 })
        .withMessage("First name must be 2-30 characters."),

    body("lastName")
        .trim()
        .notEmpty()
        .withMessage("Last name is required.")
        .isLength({ min: 2, max: 30 })
        .withMessage("Last name must be 2-30 characters."),

    body("email")
        .trim()
        .normalizeEmail()
        .isEmail()
        .withMessage("Valid email required."),

    body("password")
        .isLength({ min: 8 })
        .withMessage("Password must be at least 8 characters.")
        .matches(/[A-Z]/)
        .withMessage("Password must contain an uppercase letter.")
        .matches(/[a-z]/)
        .withMessage("Password must contain a lowercase letter.")
        .matches(/[0-9]/)
        .withMessage("Password must contain a number."),

    validate

];

// ========================================
// Login
// ========================================

const loginValidation = [

    body("email")
        .normalizeEmail()
        .isEmail()
        .withMessage("Email is required."),

    body("password")
        .notEmpty()
        .withMessage("Password is required."),

    validate

];

// ========================================
// Product Listing
// ========================================

const productValidation = [

    body("title")
        .trim()
        .notEmpty()
        .withMessage("Title is required.")
        .isLength({ min: 5, max: 120 })
        .withMessage("Title must be 5-120 characters."),

    body("description")
        .trim()
        .notEmpty()
        .withMessage("Description is required.")
        .isLength({ min: 20, max: 5000 })
        .withMessage("Description must be 20-5000 characters."),

    body("price")
        .isFloat({ min: 0 })
        .withMessage("Price must be greater than 0."),

    body("category")
        .trim()
        .notEmpty()
        .withMessage("Category is required."),

    body("condition")
        .optional()
        .isIn([
            "New",
            "Like New",
            "Excellent",
            "Good",
            "Fair",
            "Used"
        ])
        .withMessage("Invalid condition."),

    body("quantity")
        .optional()
        .isInt({ min: 1 })
        .withMessage("Quantity must be at least 1."),

    validate

];

// ========================================
// Update Product
// ========================================

const updateProductValidation = [

    body("title")
        .optional()
        .trim()
        .isLength({ min: 5, max: 120 }),

    body("description")
        .optional()
        .trim()
        .isLength({ min: 20 }),

    body("price")
        .optional()
        .isFloat({ min: 0 }),

    body("category")
        .optional()
        .trim(),

    validate

];

// ========================================
// Mongo ID Validation
// ========================================

const idValidation = [

    param("id")
        .isMongoId()
        .withMessage("Invalid ID."),

    validate

];

// ========================================
// Reviews
// ========================================

const reviewValidation = [

    body("rating")
        .isInt({ min: 1, max: 5 })
        .withMessage("Rating must be between 1 and 5."),

    body("comment")
        .trim()
        .isLength({ min: 5, max: 1000 })
        .withMessage("Comment must be 5-1000 characters."),

    validate

];

// ========================================
// Address
// ========================================

const addressValidation = [

    body("street")
        .trim()
        .notEmpty(),

    body("city")
        .trim()
        .notEmpty(),

    body("province")
        .trim()
        .notEmpty(),

    body("postalCode")
        .trim()
        .notEmpty(),

    body("country")
        .trim()
        .notEmpty(),

    validate

];

// ========================================
// Export
// ========================================

module.exports = {

    validate,

    registerValidation,

    loginValidation,

    productValidation,

    updateProductValidation,

    reviewValidation,

    addressValidation,

    idValidation

};
