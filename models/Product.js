// ==========================================
// models/Product.js
// Halo Marketplace Product Model
// ==========================================

const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({

    title: {
        type: String,
        required: true,
        trim: true,
        maxlength: 150
    },

    slug: {
        type: String,
        unique: true,
        lowercase: true,
        trim: true
    },

    description: {
        type: String,
        required: true,
        maxlength: 10000
    },

    shortDescription: {
        type: String,
        maxlength: 300,
        default: ""
    },

    vendor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
        required: true
    },

    brand: {
        type: String,
        default: ""
    },

    sku: {
        type: String,
        unique: true
    },

    barcode: {
        type: String,
        default: ""
    },

    images: [{
        url: String,
        publicId: String
    }],

    price: {
        type: Number,
        required: true,
        min: 0
    },

    salePrice: {
        type: Number,
        default: 0
    },

    costPrice: {
        type: Number,
        default: 0
    },

    inventory: {
        type: Number,
        default: 0
    },

    lowStockAlert: {
        type: Number,
        default: 5
    },

    weight: {
        type: Number,
        default: 0
    },

    dimensions: {

        length: Number,
        width: Number,
        height: Number

    },

    condition: {
        type: String,
        enum: [
            "new",
            "used",
            "refurbished"
        ],
        default: "new"
    },

    shipping: {

        freeShipping: {
            type: Boolean,
            default: false
        },

        shippingPrice: {
            type: Number,
            default: 0
        }

    },

    featured: {
        type: Boolean,
        default: false
    },

    status: {
        type: String,
        enum: [
            "draft",
            "active",
            "sold",
            "archived"
        ],
        default: "draft"
    },

    views: {
        type: Number,
        default: 0
    },

    purchases: {
        type: Number,
        default: 0
    },

    averageRating: {
        type: Number,
        default: 0
    },

    totalReviews: {
        type: Number,
        default: 0
    },

    tags: [{
        type: String
    }]

}, {
    timestamps: true
});

// ==========================================
// Indexes
// ==========================================

productSchema.index({
    title: "text",
    description: "text",
    brand: "text"
});

productSchema.index({
    category: 1
});

productSchema.index({
    vendor: 1
});

productSchema.index({
    price: 1
});

productSchema.index({
    status: 1
});

// ==========================================
// Export
// ==========================================

module.exports = mongoose.model("Product", productSchema);
