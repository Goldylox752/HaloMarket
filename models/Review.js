// ==========================================
// models/Review.js
// Halo Marketplace Review Model
// ==========================================

const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema({

    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true
    },

    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    order: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Order"
    },

    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    },

    title: {
        type: String,
        trim: true,
        maxlength: 100,
        default: ""
    },

    comment: {
        type: String,
        trim: true,
        maxlength: 3000,
        required: true
    },

    images: [{
        url: String,
        publicId: String
    }],

    verifiedPurchase: {
        type: Boolean,
        default: false
    },

    helpfulCount: {
        type: Number,
        default: 0
    },

    reportedCount: {
        type: Number,
        default: 0
    },

    isApproved: {
        type: Boolean,
        default: true
    }

}, {
    timestamps: true
});

// One review per user per product
reviewSchema.index(
    { product: 1, user: 1 },
    { unique: true }
);

reviewSchema.index({ rating: 1 });
reviewSchema.index({ product: 1 });
reviewSchema.index({ createdAt: -1 });

module.exports = mongoose.model("Review", reviewSchema);
