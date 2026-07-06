// ========================================
// Halo Marketplace
// controllers/reviewController.js
// Part 1A
// ========================================

const Review = require("../models/Review");
const Product = require("../models/Product");
const Order = require("../models/Order");

const logger = require("../utils/logger");

// ========================================
// Recalculate Product Rating
// ========================================

const updateProductRating = async (productId) => {

    const reviews = await Review.find({
        product: productId,
        status: "approved"
    });

    if (!reviews.length) {

        await Product.findByIdAndUpdate(productId, {
            averageRating: 0,
            reviewCount: 0
        });

        return;

    }

    const total = reviews.reduce(
        (sum, review) => sum + review.rating,
        0
    );

    const average =
        Number((total / reviews.length).toFixed(1));

    await Product.findByIdAndUpdate(productId, {

        averageRating: average,

        reviewCount: reviews.length

    });

};

// ========================================
// Create Review
// ========================================

exports.createReview = async (req, res) => {

    try {

        const {

            productId,

            rating,

            title,

            comment

        } = req.body;

        // Validate rating

        if (
            !rating ||
            rating < 1 ||
            rating > 5
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "Rating must be between 1 and 5."

            });

        }

        const product =
            await Product.findById(productId);

        if (!product) {

            return res.status(404).json({

                success: false,

                message:
                    "Product not found."

            });

        }

        // Optional:
        // Require customer to have purchased
        // the product before reviewing.

        const purchased =
            await Order.exists({

                customer: req.user._id,

                "items.product": productId,

                orderStatus: "completed"

            });

        if (!purchased) {

            return res.status(403).json({

                success: false,

                message:
                    "You can only review products you've purchased."

            });

        }

        // Prevent duplicate reviews

        const existing =
            await Review.findOne({

                product: productId,

                user: req.user._id

            });

        if (existing) {

            return res.status(400).json({

                success: false,

                message:
                    "You have already reviewed this product."

            });

        }

        const review =
            await Review.create({

                product: productId,

                user: req.user._id,

                vendor: product.vendor,

                rating,

                title,

                comment,

                verifiedPurchase: true,

                helpfulVotes: 0,

                reportCount: 0,

                status: "approved"

            });

        await review.populate(
            "user",
            "name avatar"
        );

        await updateProductRating(productId);

        logger.info(

            `Review ${review._id} created.`

        );

        return res.status(201).json({

            success: true,

            message:
                "Review submitted successfully.",

            review

        });

    }

    catch (err) {

        logger.error(err);

        return res.status(500).json({

            success: false,

            message:
                "Unable to create review."

        });

    }

};

// ========================================
// Continue in Part 1B
// ========================================

// ========================================
// Update Review
// ========================================

exports.updateReview = async (req, res) => {

    try {

        const { id } = req.params;

        const {
            rating,
            title,
            comment
        } = req.body;

        const review = await Review.findById(id);

        if (!review) {

            return res.status(404).json({

                success: false,

                message: "Review not found."

            });

        }

        // Owner or Admin
        if (
            review.user.toString() !== req.user._id.toString() &&
            req.user.role !== "admin"
        ) {

            return res.status(403).json({

                success: false,

                message: "Unauthorized."

            });

        }

        if (
            rating &&
            (rating < 1 || rating > 5)
        ) {

            return res.status(400).json({

                success: false,

                message: "Rating must be between 1 and 5."

            });

        }

        if (rating !== undefined)
            review.rating = rating;

        if (title !== undefined)
            review.title = title;

        if (comment !== undefined)
            review.comment = comment;

        // Optional moderation workflow
        if (req.user.role !== "admin") {
            review.status = "pending";
        }

        await review.save();

        await updateProductRating(review.product);

        logger.info(
            `Review ${review._id} updated`
        );

        return res.json({

            success: true,

            message: "Review updated successfully.",

            review

        });

    } catch (err) {

        logger.error(err);

        return res.status(500).json({

            success: false,

            message: "Unable to update review."

        });

    }

};

// ========================================
// Delete Review
// ========================================

exports.deleteReview = async (req, res) => {

    try {

        const { id } = req.params;

        const review = await Review.findById(id);

        if (!review) {

            return res.status(404).json({

                success: false,

                message: "Review not found."

            });

        }

        // Owner or Admin
        if (
            review.user.toString() !== req.user._id.toString() &&
            req.user.role !== "admin"
        ) {

            return res.status(403).json({

                success: false,

                message: "Unauthorized."

            });

        }

        const productId = review.product;

        await review.deleteOne();

        await updateProductRating(productId);

        logger.info(
            `Review ${id} deleted`
        );

        return res.json({

            success: true,

            message: "Review deleted successfully."

        });

    } catch (err) {

        logger.error(err);

        return res.status(500).json({

            success: false,

            message: "Unable to delete review."

        });

    }

};

// ========================================
// Continue in Part 2A
// ========================================

// ========================================
// Get Product Reviews
// ========================================

exports.getProductReviews = async (req, res) => {

    try {

        const productId = req.params.productId;

        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const filter = {
            product: productId,
            status: "approved"
        };

        if (req.query.rating) {

            filter.rating = Number(req.query.rating);

        }

        let sort = {
            createdAt: -1
        };

        switch (req.query.sort) {

            case "oldest":
                sort = { createdAt: 1 };
                break;

            case "highest":
                sort = { rating: -1 };
                break;

            case "lowest":
                sort = { rating: 1 };
                break;

            case "helpful":
                sort = { helpfulVotes: -1 };
                break;

        }

        const reviews = await Review.find(filter)
            .populate("user", "name avatar")
            .sort(sort)
            .skip(skip)
            .limit(limit);

        const total = await Review.countDocuments(filter);

        return res.json({

            success: true,

            page,

            pages: Math.ceil(total / limit),

            total,

            reviews

        });

    } catch (err) {

        logger.error(err);

        return res.status(500).json({

            success: false,

            message: "Unable to retrieve reviews."

        });

    }

};

// ========================================
// Get Vendor Reviews
// ========================================

exports.getVendorReviews = async (req, res) => {

    try {

        const vendorId = req.params.vendorId;

        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 10;

        const skip = (page - 1) * limit;

        const reviews = await Review.find({

            vendor: vendorId,

            status: "approved"

        })
            .populate("user", "name avatar")
            .populate("product", "name slug")
            .sort({
                createdAt: -1
            })
            .skip(skip)
            .limit(limit);

        const total =
            await Review.countDocuments({

                vendor: vendorId,

                status: "approved"

            });

        return res.json({

            success: true,

            page,

            pages: Math.ceil(total / limit),

            total,

            reviews

        });

    } catch (err) {

        logger.error(err);

        return res.status(500).json({

            success: false,

            message:
                "Unable to retrieve vendor reviews."

        });

    }

};

// ========================================
// Get Review By ID
// ========================================

exports.getReviewById = async (req, res) => {

    try {

        const review = await Review.findById(
            req.params.id
        )
            .populate("user", "name avatar")
            .populate("product", "name slug");

        if (!review) {

            return res.status(404).json({

                success: false,

                message: "Review not found."

            });

        }

        return res.json({

            success: true,

            review

        });

    } catch (err) {

        logger.error(err);

        return res.status(500).json({

            success: false,

            message:
                "Unable to retrieve review."

        });

    }

};

// ========================================
// Continue in Part 2B
// ========================================

// ========================================
// Mark Review Helpful
// ========================================

exports.voteHelpful = async (req, res) => {

    try {

        const review = await Review.findById(
            req.params.id
        );

        if (!review) {

            return res.status(404).json({
                success: false,
                message: "Review not found."
            });

        }

        review.helpfulVotes =
            (review.helpfulVotes || 0) + 1;

        await review.save();

        return res.json({

            success: true,

            helpfulVotes:
                review.helpfulVotes

        });

    } catch (err) {

        logger.error(err);

        return res.status(500).json({

            success: false,

            message:
                "Unable to vote."

        });

    }

};

// ========================================
// Report Review
// ========================================

exports.reportReview = async (req, res) => {

    try {

        const review = await Review.findById(
            req.params.id
        );

        if (!review) {

            return res.status(404).json({

                success: false,

                message: "Review not found."

            });

        }

        review.reportCount =
            (review.reportCount || 0) + 1;

        // Automatically hide after several reports
        if (review.reportCount >= 5) {

            review.status = "pending";

        }

        await review.save();

        logger.info(
            `Review ${review._id} reported`
        );

        return res.json({

            success: true,

            message:
                "Review reported successfully."

        });

    } catch (err) {

        logger.error(err);

        return res.status(500).json({

            success: false,

            message:
                "Unable to report review."

        });

    }

};

// ========================================
// Product Rating Summary
// ========================================

exports.getAverageRating = async (req, res) => {

    try {

        const productId = req.params.productId;

        const stats = await Review.aggregate([

            {
                $match: {
                    product: productId,
                    status: "approved"
                }
            },

            {
                $group: {

                    _id: null,

                    averageRating: {
                        $avg: "$rating"
                    },

                    reviewCount: {
                        $sum: 1
                    }

                }

            }

        ]);

        const breakdown = await Review.aggregate([

            {
                $match: {
                    product: productId,
                    status: "approved"
                }
            },

            {
                $group: {

                    _id: "$rating",

                    count: {
                        $sum: 1
                    }

                }

            },

            {
                $sort: {
                    _id: -1
                }
            }

        ]);

        return res.json({

            success: true,

            summary: {

                averageRating:
                    stats.length
                        ? Number(
                            stats[0].averageRating.toFixed(1)
                        )
                        : 0,

                reviewCount:
                    stats.length
                        ? stats[0].reviewCount
                        : 0,

                breakdown

            }

        });

    } catch (err) {

        logger.error(err);

        return res.status(500).json({

            success: false,

            message:
                "Unable to retrieve ratings."

        });

    }

};

// ========================================
// Approve Review (Admin)
// ========================================

exports.approveReview = async (req, res) => {

    try {

        if (req.user.role !== "admin") {

            return res.status(403).json({

                success: false,

                message:
                    "Admin access required."

            });

        }

        const review =
            await Review.findByIdAndUpdate(

                req.params.id,

                {
                    status: "approved"
                },

                {
                    new: true
                }

            );

        if (!review) {

            return res.status(404).json({

                success: false,

                message:
                    "Review not found."

            });

        }

        await updateProductRating(
            review.product
        );

        return res.json({

            success: true,

            review

        });

    } catch (err) {

        logger.error(err);

        return res.status(500).json({

            success: false,

            message:
                "Unable to approve review."

        });

    }

};

// ========================================
// Reject Review (Admin)
// ========================================

exports.rejectReview = async (req, res) => {

    try {

        if (req.user.role !== "admin") {

            return res.status(403).json({

                success: false,

                message:
                    "Admin access required."

            });

        }

        const review =
            await Review.findByIdAndUpdate(

                req.params.id,

                {
                    status: "rejected"
                },

                {
                    new: true
                }

            );

        if (!review) {

            return res.status(404).json({

                success: false,

                message:
                    "Review not found."

            });

        }

        await updateProductRating(
            review.product
        );

        return res.json({

            success: true,

            review

        });

    } catch (err) {

        logger.error(err);

        return res.status(500).json({

            success: false,

            message:
                "Unable to reject review."

        });

    }

};

// ========================================
// Module Exports
// ========================================

module.exports = {

    createReview: exports.createReview,

    updateReview: exports.updateReview,

    deleteReview: exports.deleteReview,

    getProductReviews: exports.getProductReviews,

    getVendorReviews: exports.getVendorReviews,

    getReviewById: exports.getReviewById,

    voteHelpful: exports.voteHelpful,

    reportReview: exports.reportReview,

    getAverageRating: exports.getAverageRating,

    approveReview: exports.approveReview,

    rejectReview: exports.rejectReview

};


