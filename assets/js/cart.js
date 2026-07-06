const CART_KEY = "halo_cart";

// ========================
// GET CART
// ========================
function getCart() {
    return JSON.parse(localStorage.getItem(CART_KEY)) || [];
}

// ========================
// SAVE CART
// ========================
function saveCart(cart) {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
}

// ========================
// ADD TO CART
// ========================
function addToCart(product) {
    const cart = getCart();

    const existing = cart.find(item => item.id === product.id);

    if (existing) {
        existing.qty += 1;
    } else {
        cart.push({ ...product, qty: 1 });
    }

    saveCart(cart);
    updateCartUI();
}

// ========================
// REMOVE ITEM
// ========================
function removeFromCart(id) {
    let cart = getCart();
    cart = cart.filter(item => item.id !== id);
    saveCart(cart);
    updateCartUI();
}

// ========================
// TOTAL PRICE
// ========================
function getTotal() {
    return getCart().reduce((sum, item) => sum + item.price * item.qty, 0);
}