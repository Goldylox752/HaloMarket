// ==========================================
// models/Vendor.js
// Halo Marketplace Vendor Model
// ==========================================

const mongoose = require("mongoose");

const vendorSchema = new mongoose.Schema({

    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        unique: true
    },

    storeName: {
        type: String,
        required: true,
        trim: true,
        unique: true,
        maxlength: 100
    },

    slug: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },

    logo: {
        type: String,
        default: ""
    },

    banner: {
        type: String,
        default: ""
    },

    description: {
        type: String,
        default: "",
        maxlength: 3000
    },

    email: {
        type: String,
        required: true,
        lowercase: true,
        trim: true
    },

    phone: {
        type: String,
        default: ""
    },

    website: {
        type: String,
        default: ""
    },

    address: {

        street: String,

        city: String,

        province: String,

        postalCode: String,

        country: {
            type: String,
            default: "Canada"
        }

    },

    social: {

        facebook: String,

        instagram: String,

        x: String,

        youtube: String,

        tiktok: String

    },

    stripeAccountId: {
        type: String,
        default: ""
    },

    verified: {
        type: Boolean,
        default: false
    },

    featured: {
        type: Boolean,
        default: false
    },

    rating: {
        type: Number,
        default: 0
    },

    reviewCount: {
        type: Number,
        default: 0
    },

    productCount: {
        type: Number,
        default: 0
    },

    totalSales: {
        type: Number,
        default: 0
    },

    totalRevenue: {
        type: Number,
        default: 0
    },

    shippingPolicy: {
        type: String,
        default: ""
    },

    returnPolicy: {
        type: String,
        default: ""
    },

    status: {
        type: String,
        enum: [
            "pending",
            "approved",
            "suspended",
            "closed"
        ],
        default: "pending"
    }

}, {
    timestamps: true
});

// ==========================================
// Indexes
// ==========================================

vendorSchema.index({ storeName: 1 });

vendorSchema.index({ slug: 1 });

vendorSchema.index({ owner: 1 });

vendorSchema.index({ featured: 1 });

vendorSchema.index({ verified: 1 });

// ==========================================
// Export
// ==========================================

module.exports = mongoose.model("Vendor", vendorSchema);
