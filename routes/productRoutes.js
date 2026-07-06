// ========================================
// Halo Marketplace
// routes/productRoutes.js
// ========================================

const express = require("express");
const router = express.Router();

// Controllers
const productController = require("../controllers/productController");

// Middleware
const auth = require("../middleware/auth");

const {
    requireAuth,
    vendorOnly
} = require("../middleware/permissions");

const {
    productValidation,
    idValidation
} = require("../middleware/validators");

const {
    sanitizeBody,
    sanitizeQuery
} = require("../middleware/sanitizers");

// ========================================
// Public Routes
// ========================================

// Browse products
router.get(
    "/",
    sanitizeQuery,
    productController.getProducts
);

// Featured products
router.get(
    "/featured",
    productController.getFeaturedProducts
);

// New arrivals
router.get(
    "/new",
    productController.getNewProducts
);

// Best sellers
router.get(
    "/best-sellers",
    productController.getBestSellingProducts
);

// Trending products
router.get(
    "/trending",
    productController.getTrendingProducts
);

// Products by category
router.get(
    "/category/:category",
    productController.getProductsByCategory
);

// Products by brand
router.get(
    "/brand/:brand",
    productController.getProductsByBrand
);

// Product search
router.get(
    "/search",
    sanitizeQuery,
    productController.searchProducts
);

// Product details
router.get(
    "/:id",
    idValidation,
    productController.getProduct
);

// Similar products
router.get(
    "/:id/related",
    idValidation,
    productController.getRelatedProducts
);

// ========================================
// Vendor Routes
// ========================================

// Create product
router.post(
    "/",
    auth,
    requireAuth,
    vendorOnly,
    sanitizeBody,
    productValidation,
    productController.createProduct
);

// Update product
router.put(
    "/:id",
    auth,
    requireAuth,
    vendorOnly,
    idValidation,
    sanitizeBody,
    productController.updateProduct
);

// Delete product
router.delete(
    "/:id",
    auth,
    requireAuth,
    vendorOnly,
    idValidation,
    productController.deleteProduct
);

// ========================================
// Product Images
// ========================================

// Upload images
router.post(
    "/:id/images",
    auth,
    requireAuth,
    vendorOnly,
    idValidation,
    productController.uploadImages
);

// Delete image
router.delete(
    "/:id/images/:imageId",
    auth,
    requireAuth,
    vendorOnly,
    productController.deleteImage
);

// ========================================
// Inventory
// ========================================

// Update stock
router.put(
    "/:id/inventory",
    auth,
    requireAuth,
    vendorOnly,
    idValidation,
    productController.updateInventory
);

// Toggle active/inactive
router.patch(
    "/:id/status",
    auth,
    requireAuth,
    vendorOnly,
    idValidation,
    productController.updateStatus
);

// ========================================
// Pricing
// ========================================

// Update price
router.patch(
    "/:id/price",
    auth,
    requireAuth,
    vendorOnly,
    idValidation,
    sanitizeBody,
    productController.updatePrice
);

// ========================================
// Favorites
// ========================================

// Save product
router.post(
    "/:id/favorite",
    auth,
    requireAuth,
    idValidation,
    productController.favoriteProduct
);

// Remove favorite
router.delete(
    "/:id/favorite",
    auth,
    requireAuth,
    idValidation,
    productController.unfavoriteProduct
);

// ========================================
// Analytics
// ========================================

// Product analytics
router.get(
    "/:id/analytics",
    auth,
    requireAuth,
    vendorOnly,
    idValidation,
    productController.getAnalytics
);

// ========================================
// Admin
// ========================================

// Approve listing
router.patch(
    "/:id/approve",
    auth,
    requireAuth,
    productController.approveProduct
);

// Reject listing
router.patch(
    "/:id/reject",
    auth,
    requireAuth,
    productController.rejectProduct
);

// Feature listing
router.patch(
    "/:id/feature",
    auth,
    requireAuth,
    productController.featureProduct
);

module.exports = router;
