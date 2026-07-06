// ========================================
// Halo Marketplace
// controllers/cartController.js
// ========================================

const Cart = require("../models/Cart");
const Product = require("../models/Product");
const Coupon = require("../models/Coupon");

const logger = require("../utils/logger");

// ========================================
// Calculate Cart Totals
// ========================================

const calculateTotals = async (cart) => {

    let subtotal = 0;

    cart.items.forEach(item => {
        item.subtotal = item.price * item.quantity;
        subtotal += item.subtotal;
    });

    cart.subtotal = subtotal;

    // Discount
    cart.discount = cart.discount || 0;

    // Shipping (example)
    cart.shipping = subtotal >= 100 ? 0 : 12.99;

    // Tax (example 5%)
    cart.tax = Number((subtotal * 0.05).toFixed(2));

    cart.total =
        subtotal +
        cart.shipping +
        cart.tax -
        cart.discount;

    return cart;
};

// ========================================
// Get Current Cart
// ========================================

exports.getCart = async (req, res) => {

    try {

        let cart = await Cart.findOne({
            user: req.user._id
        })
            .populate("items.product");

        if (!cart) {

            cart = await Cart.create({
                user: req.user._id,
                items: []
            });

        }

        await calculateTotals(cart);

        await cart.save();

        return res.json({
            success: true,
            cart
        });

    } catch (err) {

        logger.error(err);

        return res.status(500).json({
            success: false,
            message: "Unable to load cart."
        });

    }

};

// ========================================
// Add Product To Cart
// ========================================

exports.addToCart = async (req, res) => {

    try {

        const { productId, quantity = 1 } = req.body;

        const product = await Product.findById(productId);

        if (!product) {

            return res.status(404).json({
                success: false,
                message: "Product not found."
            });

        }

        if (!product.active) {

            return res.status(400).json({
                success: false,
                message: "Product is unavailable."
            });

        }

        if (product.inventory < quantity) {

            return res.status(400).json({
                success: false,
                message: "Insufficient inventory."
            });

        }

        let cart = await Cart.findOne({
            user: req.user._id
        });

        if (!cart) {

            cart = await Cart.create({
                user: req.user._id,
                items: []
            });

        }

        const existing = cart.items.find(item =>
            item.product.toString() === product._id.toString()
        );

        if (existing) {

            existing.quantity += Number(quantity);

            if (existing.quantity > product.inventory) {

                existing.quantity = product.inventory;

            }

            existing.price = product.price;

        } else {

            cart.items.push({

                product: product._id,

                vendor: product.vendor,

                quantity: Number(quantity),

                price: product.price,

                subtotal: product.price * quantity

            });

        }

        await calculateTotals(cart);

        await cart.save();

        await cart.populate("items.product");

        logger.info(
            `Product ${product._id} added to cart by ${req.user._id}`
        );

        return res.status(200).json({

            success: true,

            message: "Product added to cart.",

            cart

        });

    } catch (err) {

        logger.error(err);

        return res.status(500).json({

            success: false,

            message: "Unable to add product."

        });

    }

};

// ========================================
// Update Cart Item Quantity
// (Continue in Part 2)
// ========================================



// ========================================
// Update Cart Item Quantity
// ========================================

exports.updateCartItem = async (req, res) => {

    try {

        const { id } = req.params;
        const { quantity } = req.body;

        if (!quantity || quantity < 1) {
            return res.status(400).json({
                success: false,
                message: "Quantity must be at least 1."
            });
        }

        const cart = await Cart.findOne({
            user: req.user._id
        });

        if (!cart) {
            return res.status(404).json({
                success: false,
                message: "Cart not found."
            });
        }

        const item = cart.items.id(id);

        if (!item) {
            return res.status(404).json({
                success: false,
                message: "Cart item not found."
            });
        }

        const product = await Product.findById(item.product);

        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product no longer exists."
            });
        }

        if (!product.active) {
            return res.status(400).json({
                success: false,
                message: "Product is unavailable."
            });
        }

        if (quantity > product.inventory) {
            return res.status(400).json({
                success: false,
                message: `Only ${product.inventory} item(s) available.`
            });
        }

        item.quantity = Number(quantity);
        item.price = product.price;
        item.subtotal = product.price * quantity;

        await calculateTotals(cart);

        await cart.save();

        await cart.populate("items.product");

        logger.info(
            `Cart updated by ${req.user._id}`
        );

        return res.json({
            success: true,
            message: "Cart updated successfully.",
            cart
        });

    } catch (err) {

        logger.error(err);

        return res.status(500).json({
            success: false,
            message: "Unable to update cart."
        });

    }

};

// ========================================
// Remove Item From Cart
// ========================================

exports.removeCartItem = async (req, res) => {

    try {

        const { id } = req.params;

        const cart = await Cart.findOne({
            user: req.user._id
        });

        if (!cart) {
            return res.status(404).json({
                success: false,
                message: "Cart not found."
            });
        }

        const item = cart.items.id(id);

        if (!item) {
            return res.status(404).json({
                success: false,
                message: "Item not found."
            });
        }

        item.deleteOne();

        await calculateTotals(cart);

        await cart.save();

        await cart.populate("items.product");

        logger.info(
            `Item removed from cart by ${req.user._id}`
        );

        return res.json({
            success: true,
            message: "Item removed from cart.",
            cart
        });

    } catch (err) {

        logger.error(err);

        return res.status(500).json({
            success: false,
            message: "Unable to remove cart item."
        });

    }

};

// ========================================
// Apply Coupon
// ========================================

exports.applyCoupon = async (req, res) => {

    try {

        const { code } = req.body;

        if (!code) {
            return res.status(400).json({
                success: false,
                message: "Coupon code is required."
            });
        }

        const cart = await Cart.findOne({
            user: req.user._id
        });

        if (!cart || cart.items.length === 0) {
            return res.status(400).json({
                success: false,
                message: "Your cart is empty."
            });
        }

        const coupon = await Coupon.findOne({
            code: code.toUpperCase(),
            active: true
        });

        if (!coupon) {
            return res.status(404).json({
                success: false,
                message: "Coupon not found."
            });
        }

        if (coupon.expiresAt && coupon.expiresAt < new Date()) {
            return res.status(400).json({
                success: false,
                message: "Coupon has expired."
            });
        }

        await calculateTotals(cart);

        if (
            coupon.minimumPurchase &&
            cart.subtotal < coupon.minimumPurchase
        ) {
            return res.status(400).json({
                success: false,
                message: `Minimum purchase is $${coupon.minimumPurchase}.`
            });
        }

        let discount = 0;

        if (coupon.discountType === "percentage") {

            discount =
                cart.subtotal *
                (coupon.discountValue / 100);

            if (
                coupon.maximumDiscount &&
                discount > coupon.maximumDiscount
            ) {
                discount = coupon.maximumDiscount;
            }

        } else {

            discount = coupon.discountValue;

        }

        cart.coupon = coupon._id;
        cart.discount = Number(discount.toFixed(2));

        await calculateTotals(cart);

        await cart.save();

        return res.json({
            success: true,
            message: "Coupon applied.",
            cart
        });

    } catch (err) {

        logger.error(err);

        return res.status(500).json({
            success: false,
            message: "Unable to apply coupon."
        });

    }

};

// ========================================
// Remove Coupon
// ========================================

exports.removeCoupon = async (req, res) => {

    try {

        const cart = await Cart.findOne({
            user: req.user._id
        });

        if (!cart) {

            return res.status(404).json({
                success: false,
                message: "Cart not found."
            });

        }

        cart.coupon = null;
        cart.discount = 0;

        await calculateTotals(cart);

        await cart.save();

        return res.json({
            success: true,
            message: "Coupon removed.",
            cart
        });

    } catch (err) {

        logger.error(err);

        return res.status(500).json({
            success: false,
            message: "Unable to remove coupon."
        });

    }

};

// ========================================
// Cart Summary
// ========================================

exports.getCartSummary = async (req, res) => {

    try {

        const cart = await Cart.findOne({
            user: req.user._id
        }).populate("items.product");

        if (!cart) {

            return res.json({
                success: true,
                summary: {
                    items: 0,
                    subtotal: 0,
                    shipping: 0,
                    tax: 0,
                    discount: 0,
                    total: 0
                }
            });

        }

        await calculateTotals(cart);

        await cart.save();

        const itemCount = cart.items.reduce(
            (total, item) => total + item.quantity,
            0
        );

        return res.json({

            success: true,

            summary: {

                items: itemCount,

                subtotal: cart.subtotal,

                shipping: cart.shipping,

                tax: cart.tax,

                discount: cart.discount,

                total: cart.total

            }

        });

    } catch (err) {

        logger.error(err);

        return res.status(500).json({

            success: false,

            message: "Unable to load cart summary."

        });

    }

};

// ========================================
// Module Exports
// ========================================

module.exports = {

    getCart: exports.getCart,

    addToCart: exports.addToCart,

    updateCartItem: exports.updateCartItem,

    removeCartItem: exports.removeCartItem,

    clearCart: exports.clearCart,

    saveForLater: exports.saveForLater,

    moveToCart: exports.moveToCart,

    applyCoupon: exports.applyCoupon,

    removeCoupon: exports.removeCoupon,

    getCartSummary: exports.getCartSummary

};
