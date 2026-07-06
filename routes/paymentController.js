// ========================================
// Halo Marketplace
// controllers/paymentController.js
// Part 1A
// ========================================

const Stripe = require("stripe");

const stripe = new Stripe(
    process.env.STRIPE_SECRET_KEY
);

const Cart = require("../models/Cart");
const Order = require("../models/Order");
const Payment = require("../models/Payment");

const logger = require("../utils/logger");

// ========================================
// Helpers
// ========================================

const dollarsToCents = (amount) => {
    return Math.round(Number(amount) * 100);
};

const centsToDollars = (amount) => {
    return Number((amount / 100).toFixed(2));
};

const calculateCartTotal = (cart) => {

    let subtotal = 0;

    for (const item of cart.items) {

        subtotal += item.price * item.quantity;

    }

    const shipping = cart.shipping || 0;
    const tax = cart.tax || 0;
    const discount = cart.discount || 0;

    return Number(
        (
            subtotal +
            shipping +
            tax -
            discount
        ).toFixed(2)
    );

};

// ========================================
// Create Payment Intent
// ========================================

exports.createPaymentIntent = async (
    req,
    res
) => {

    try {

        const cart = await Cart.findOne({
            user: req.user._id
        }).populate("items.product");

        if (!cart) {

            return res.status(404).json({

                success: false,

                message: "Cart not found."

            });

        }

        if (cart.items.length === 0) {

            return res.status(400).json({

                success: false,

                message: "Your cart is empty."

            });

        }

        const total =
            calculateCartTotal(cart);

        if (total <= 0) {

            return res.status(400).json({

                success: false,

                message: "Invalid payment amount."

            });

        }

        const paymentIntent =
            await stripe.paymentIntents.create({

                amount:
                    dollarsToCents(total),

                currency: "cad",

                automatic_payment_methods: {

                    enabled: true

                },

                metadata: {

                    userId:
                        req.user._id.toString(),

                    cartId:
                        cart._id.toString(),

                    itemCount:
                        cart.items.length.toString()

                }

            });

        await Payment.create({

            user:
                req.user._id,

            cart:
                cart._id,

            paymentIntentId:
                paymentIntent.id,

            amount:
                total,

            currency: "CAD",

            status:
                paymentIntent.status,

            provider:
                "stripe"

        });

        logger.info(

            `Payment Intent ${paymentIntent.id} created.`

        );

        return res.json({

            success: true,

            clientSecret:
                paymentIntent.client_secret,

            paymentIntentId:
                paymentIntent.id,

            amount:
                total,

            currency: "CAD"

        });

    }

    catch (err) {

        logger.error(err);

        return res.status(500).json({

            success: false,

            message:
                "Unable to create payment intent."

        });

    }

};

// ========================================
// Continue in Part 1B
// ========================================

// ========================================
// Confirm Payment
// ========================================

exports.confirmPayment = async (req, res) => {

    try {

        const { paymentIntentId } = req.body;

        if (!paymentIntentId) {

            return res.status(400).json({
                success: false,
                message: "Payment Intent ID is required."
            });

        }

        const paymentIntent =
            await stripe.paymentIntents.retrieve(
                paymentIntentId
            );

        if (!paymentIntent) {

            return res.status(404).json({
                success: false,
                message: "Payment not found."
            });

        }

        const payment = await Payment.findOne({
            paymentIntentId
        });

        if (!payment) {

            return res.status(404).json({
                success: false,
                message: "Payment record not found."
            });

        }

        if (
            payment.user.toString() !==
            req.user._id.toString()
        ) {

            return res.status(403).json({
                success: false,
                message: "Unauthorized."
            });

        }

        payment.status = paymentIntent.status;
        payment.stripeResponse = paymentIntent;

        await payment.save();

        return res.json({

            success: true,

            payment: {

                id: payment._id,

                paymentIntentId,

                status: payment.status,

                amount: payment.amount,

                currency: payment.currency

            }

        });

    }

    catch (err) {

        logger.error(err);

        return res.status(500).json({

            success: false,

            message: "Unable to confirm payment."

        });

    }

};

// ========================================
// Get Payment Status
// ========================================

exports.getPaymentStatus = async (req, res) => {

    try {

        const payment =
            await Payment.findById(req.params.id);

        if (!payment) {

            return res.status(404).json({
                success: false,
                message: "Payment not found."
            });

        }

        if (
            payment.user.toString() !==
            req.user._id.toString()
        ) {

            return res.status(403).json({
                success: false,
                message: "Unauthorized."
            });

        }

        return res.json({

            success: true,

            status: payment.status,

            payment

        });

    }

    catch (err) {

        logger.error(err);

        return res.status(500).json({

            success: false,

            message:
                "Unable to retrieve payment."

        });

    }

};

// ========================================
// Cancel Payment Intent
// ========================================

exports.cancelPaymentIntent = async (
    req,
    res
) => {

    try {

        const { paymentIntentId } = req.body;

        if (!paymentIntentId) {

            return res.status(400).json({

                success: false,

                message:
                    "Payment Intent ID required."

            });

        }

        const payment =
            await Payment.findOne({
                paymentIntentId
            });

        if (!payment) {

            return res.status(404).json({

                success: false,

                message:
                    "Payment record not found."

            });

        }

        if (
            payment.user.toString() !==
            req.user._id.toString()
        ) {

            return res.status(403).json({

                success: false,

                message: "Unauthorized."

            });

        }

        const paymentIntent =
            await stripe.paymentIntents.cancel(
                paymentIntentId
            );

        payment.status = paymentIntent.status;

        await payment.save();

        logger.info(
            `Payment cancelled: ${paymentIntent.id}`
        );

        return res.json({

            success: true,

            payment

        });

    }

    catch (err) {

        logger.error(err);

        return res.status(500).json({

            success: false,

            message:
                "Unable to cancel payment."

        });

    }

};

// ========================================
// Continue in Part 2A
// ========================================

// ========================================
// Refund Payment
// ========================================

exports.refundPayment = async (req, res) => {

    try {

        const { paymentId, amount } = req.body;

        const payment = await Payment.findById(paymentId);

        if (!payment) {

            return res.status(404).json({
                success: false,
                message: "Payment not found."
            });

        }

        if (payment.status !== "succeeded") {

            return res.status(400).json({
                success: false,
                message: "Only successful payments can be refunded."
            });

        }

        const refundAmount = amount
            ? Math.round(Number(amount) * 100)
            : Math.round(payment.amount * 100);

        const refund = await stripe.refunds.create({

            payment_intent: payment.paymentIntentId,

            amount: refundAmount

        });

        payment.refundAmount =
            (payment.refundAmount || 0) +
            (refund.amount / 100);

        if (payment.refundAmount >= payment.amount) {

            payment.status = "refunded";

        } else {

            payment.status = "partially_refunded";

        }

        await payment.save();

        logger.info(
            `Refund created for payment ${payment.paymentIntentId}`
        );

        return res.json({

            success: true,

            refund,

            payment

        });

    } catch (err) {

        logger.error(err);

        return res.status(500).json({

            success: false,

            message: "Unable to process refund."

        });

    }

};

// ========================================
// Get Refund Status
// ========================================

exports.getRefundStatus = async (req, res) => {

    try {

        const payment = await Payment.findById(
            req.params.id
        );

        if (!payment) {

            return res.status(404).json({

                success: false,

                message: "Payment not found."

            });

        }

        return res.json({

            success: true,

            refunded: payment.refundAmount || 0,

            status: payment.status

        });

    } catch (err) {

        logger.error(err);

        return res.status(500).json({

            success: false,

            message: "Unable to retrieve refund."

        });

    }

};

// ========================================
// Get My Payment History
// ========================================

exports.getPaymentHistory = async (req, res) => {

    try {

        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 20;
        const skip = (page - 1) * limit;

        const payments = await Payment.find({
            user: req.user._id
        })
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .populate("order");

        const total = await Payment.countDocuments({
            user: req.user._id
        });

        return res.json({

            success: true,

            page,

            pages: Math.ceil(total / limit),

            total,

            payments

        });

    } catch (err) {

        logger.error(err);

        return res.status(500).json({

            success: false,

            message: "Unable to load payment history."

        });

    }

};

// ========================================
// Get Payment By ID
// ========================================

exports.getPaymentById = async (req, res) => {

    try {

        const payment = await Payment.findById(
            req.params.id
        )
            .populate("order")
            .populate("user", "name email");

        if (!payment) {

            return res.status(404).json({

                success: false,

                message: "Payment not found."

            });

        }

        // Owner or admin only
        if (
            payment.user._id.toString() !== req.user._id.toString() &&
            req.user.role !== "admin"
        ) {

            return res.status(403).json({

                success: false,

                message: "Unauthorized."

            });

        }

        return res.json({

            success: true,

            payment

        });

    } catch (err) {

        logger.error(err);

        return res.status(500).json({

            success: false,

            message: "Unable to retrieve payment."

        });

    }

};

// ========================================
// Admin Search Payments
// ========================================

exports.searchPayments = async (req, res) => {

    try {

        if (req.user.role !== "admin") {

            return res.status(403).json({

                success: false,

                message: "Admin access required."

            });

        }

        const filter = {};

        if (req.query.status) {

            filter.status = req.query.status;

        }

        if (req.query.provider) {

            filter.provider = req.query.provider;

        }

        if (req.query.user) {

            filter.user = req.query.user;

        }

        const payments = await Payment.find(filter)
            .populate("user", "name email")
            .populate("order")
            .sort({
                createdAt: -1
            });

        return res.json({

            success: true,

            count: payments.length,

            payments

        });

    } catch (err) {

        logger.error(err);

        return res.status(500).json({

            success: false,

            message: "Unable to search payments."

        });

    }

};

// ========================================
// Admin Get Payment Statistics
// ========================================

exports.getPaymentStatistics = async (req, res) => {

    try {

        if (req.user.role !== "admin") {

            return res.status(403).json({

                success: false,

                message: "Admin access required."

            });

        }

        const stats = await Payment.aggregate([

            {

                $group: {

                    _id: "$status",

                    totalAmount: {
                        $sum: "$amount"
                    },

                    count: {
                        $sum: 1
                    }

                }

            }

        ]);

        return res.json({

            success: true,

            statistics: stats

        });

    } catch (err) {

        logger.error(err);

        return res.status(500).json({

            success: false,

            message:
                "Unable to retrieve statistics."

        });

    }

};
