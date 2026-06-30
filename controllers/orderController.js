const Order = require("../models/Order");
const Listing = require("../models/Listing");

// CREATE ORDER
exports.createOrder = async (req, res) => {
    try {

        const { listingId, quantity, shippingAddress } = req.body;

        const listing = await Listing.findById(listingId);

        if (!listing) {
            return res.status(404).json({
                success: false,
                message: "Listing not found"
            });
        }

        const qty = quantity || 1;

        if (listing.quantity < qty) {
            return res.status(400).json({
                success: false,
                message: "Not enough inventory"
            });
        }

        const subtotal = listing.price * qty;
        const tax = subtotal * 0.05; // Example GST
        const shippingCost = listing.shipping || 0;
        const total = subtotal + tax + shippingCost;

        const order = await Order.create({
            buyer: req.user._id,
            seller: listing.seller,
            listing: listing._id,
            quantity: qty,
            price: listing.price,
            subtotal,
            tax,
            shippingCost,
            total,
            shippingAddress
        });

        res.status(201).json({
            success: true,
            order
        });

    } catch (err) {

        res.status(500).json({
            success: false,
            message: err.message
        });

    }
};

// BUYER ORDERS
exports.getMyOrders = async (req, res) => {

    try {

        const orders = await Order.find({
            buyer: req.user._id
        })
        .populate("listing")
        .populate("seller", "name email");

        res.json({
            success: true,
            orders
        });

    } catch (err) {

        res.status(500).json({
            success: false,
            message: err.message
        });

    }

};

// SELLER ORDERS
exports.getSellerOrders = async (req, res) => {

    try {

        const orders = await Order.find({
            seller: req.user._id
        })
        .populate("buyer", "name email")
        .populate("listing");

        res.json({
            success: true,
            orders
        });

    } catch (err) {

        res.status(500).json({
            success: false,
            message: err.message
        });

    }

};

// GET SINGLE ORDER
exports.getOrder = async (req, res) => {

    try {

        const order = await Order.findById(req.params.id)
            .populate("buyer", "name email")
            .populate("seller", "name email")
            .populate("listing");

        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order not found"
            });
        }

        if (
            order.buyer._id.toString() !== req.user._id.toString() &&
            order.seller._id.toString() !== req.user._id.toString()
        ) {
            return res.status(403).json({
                success: false,
                message: "Access denied"
            });
        }

        res.json({
            success: true,
            order
        });

    } catch (err) {

        res.status(500).json({
            success: false,
            message: err.message
        });

    }

};

// UPDATE ORDER STATUS
exports.updateOrderStatus = async (req, res) => {

    try {

        const order = await Order.findById(req.params.id);

        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order not found"
            });
        }

        if (order.seller.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: "Unauthorized"
            });
        }

        order.orderStatus = req.body.orderStatus;

        if (req.body.trackingNumber) {
            order.trackingNumber = req.body.trackingNumber;
        }

        await order.save();

        res.json({
            success: true,
            order
        });

    } catch (err) {

        res.status(500).json({
            success: false,
            message: err.message
        });

    }

};

// CANCEL ORDER
exports.cancelOrder = async (req, res) => {

    try {

        const order = await Order.findById(req.params.id);

        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order not found"
            });
        }

        if (order.buyer.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: "Unauthorized"
            });
        }

        order.orderStatus = "cancelled";

        await order.save();

        res.json({
            success: true,
            message: "Order cancelled",
            order
        });

    } catch (err) {

        res.status(500).json({
            success: false,
            message: err.message
        });

    }

};
