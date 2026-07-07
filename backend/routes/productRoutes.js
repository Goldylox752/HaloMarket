// ========================================
// Halo Marketplace
// routes/productRoutes.js
// ========================================


const router = require("express").Router();


const {

getProducts,
getProduct,
createProduct,
updateProduct,
deleteProduct,
getSellerProducts

} = require("../controllers/productController");


const {
protect
} = require("../middleware/auth");



const {
requireSeller
} = require("../middleware/requireSeller");




// Browse products

router.get(
"/",
getProducts
);



// Single product

router.get(
"/:id",
getProduct
);



// Seller create listing

router.post(
"/",
protect,
requireSeller,
createProduct
);



// Seller dashboard

router.get(
"/seller",
protect,
requireSeller,
getSellerProducts
);



// Update listing

router.put(
"/:id",
protect,
requireSeller,
updateProduct
);



// Delete listing

router.delete(
"/:id",
protect,
requireSeller,
deleteProduct
);



module.exports = router;