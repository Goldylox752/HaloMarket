const express = require("express");

const router = express.Router();

const expressRaw = require("express").raw;

const { protect } = require("../middleware/auth");

const {
    createCheckoutSession
} = require("../controllers/paymentController");

const {
    stripeWebhook
} = require("../controllers/webhookController");

// Stripe Webhook
router.post(
    "/webhook",
    expressRaw({ type: "application/json" }),
    stripeWebhook
);

// Create Checkout
router.post(
    "/create-checkout-session",
    protect,
    createCheckoutSession
);

module.exports = router;
