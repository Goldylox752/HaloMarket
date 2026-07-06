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
