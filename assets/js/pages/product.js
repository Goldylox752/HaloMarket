function loadProduct() {

    const url = new URL(window.location.href);
    const id = url.searchParams.get("id");

    const product = window.PRODUCTS.find(p => p.id === id);

    if (!product) {
        document.body.innerHTML = "<h2>Product not found</h2>";
        return;
    }

    document.getElementById("title").innerText = product.title;
    document.getElementById("image").src = product.image;
    document.getElementById("price").innerText = "$" + product.price;

    window.currentProduct = product;
}

function addCurrentProduct() {
    addToCart(window.currentProduct);
}