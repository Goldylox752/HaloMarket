// ========================================
// Halo Marketplace
// routes/userRoutes.js
// ========================================

const express = require("express");
const router = express.Router();

// Controllers
const userController = require("../controllers/userController");

// Middleware
const auth = require("../middleware/auth");

const {
    requireAuth
} = require("../middleware/permissions");

const {
    idValidation
} = require("../middleware/validators");

const {
    sanitizeBody
} = require("../middleware/sanitizers");

// ========================================
// Current User
// ========================================

// Get current logged in user
router.get(
    "/me",
    auth,
    requireAuth,
    userController.getCurrentUser
);

// Update current user profile
router.put(
    "/me",
    auth,
    requireAuth,
    sanitizeBody,
    userController.updateProfile
);

// Delete own account
router.delete(
    "/me",
    auth,
    requireAuth,
    userController.deleteAccount
);

// ========================================
// Password
// ========================================

// Change password
router.put(
    "/me/password",
    auth,
    requireAuth,
    sanitizeBody,
    userController.changePassword
);

// ========================================
// Avatar
// ========================================

// Upload avatar
router.post(
    "/me/avatar",
    auth,
    requireAuth,
    userController.uploadAvatar
);

// Delete avatar
router.delete(
    "/me/avatar",
    auth,
    requireAuth,
    userController.removeAvatar
);

// ========================================
// Addresses
// ========================================

// Get addresses
router.get(
    "/me/addresses",
    auth,
    requireAuth,
    userController.getAddresses
);

// Add address
router.post(
    "/me/addresses",
    auth,
    requireAuth,
    sanitizeBody,
    userController.addAddress
);

// Update address
router.put(
    "/me/addresses/:id",
    auth,
    requireAuth,
    idValidation,
    sanitizeBody,
    userController.updateAddress
);

// Delete address
router.delete(
    "/me/addresses/:id",
    auth,
    requireAuth,
    idValidation,
    userController.deleteAddress
);

// Set default address
router.put(
    "/me/addresses/:id/default",
    auth,
    requireAuth,
    idValidation,
    userController.setDefaultAddress
);

// ========================================
// Favorites / Following
// ========================================

// Favorite products
router.get(
    "/me/favorites",
    auth,
    requireAuth,
    userController.getFavorites
);

router.post(
    "/me/favorites/:id",
    auth,
    requireAuth,
    idValidation,
    userController.addFavorite
);

router.delete(
    "/me/favorites/:id",
    auth,
    requireAuth,
    idValidation,
    userController.removeFavorite
);

// ========================================
// Orders
// ========================================

router.get(
    "/me/orders",
    auth,
    requireAuth,
    userController.getMyOrders
);

// ========================================
// Notifications
// ========================================

router.get(
    "/me/notifications",
    auth,
    requireAuth,
    userController.getNotifications
);

router.put(
    "/me/notifications/read",
    auth,
    requireAuth,
    userController.markNotificationsRead
);

// ========================================
// Public User Profiles
// ========================================

// Public seller profile
router.get(
    "/:id",
    idValidation,
    userController.getPublicProfile
);

// Public seller listings
router.get(
    "/:id/products",
    idValidation,
    userController.getUserProducts
);

// Seller reviews
router.get(
    "/:id/reviews",
    idValidation,
    userController.getUserReviews
);

module.exports = router;
