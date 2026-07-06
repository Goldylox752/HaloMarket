async function loadProduct() {

    const url = new URL(window.location.href);
    const id = url.searchParams.get("id");

    try {
        const res = await fetch(`/api/products/${id}`);
        const product = await res.json();

        if (!res.ok) {
            document.body.innerHTML = "<h2>Product not found</h2>";
            return;
        }

        document.getElementById("title").innerText = product.title;
        document.getElementById("image").src = product.image;
        document.getElementById("price").innerText = "$" + product.price;

        window.currentProduct = product;

    } catch (err) {
        console.error(err);
    }
}

function addCurrentProduct() {
    addToCart(window.currentProduct);
}