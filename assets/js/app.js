/* =====================================
HALO MARKETPLACE
Production Application JavaScript
===================================== */


const API_URL =
window.API_URL ||
"/api/v1";




// =====================================
// TOAST SYSTEM
// =====================================


function showToast(message){


let toast =
document.getElementById("toast");



if(!toast){


toast =
document.createElement("div");


toast.id="toast";


document.body.appendChild(toast);


}



toast.textContent = message;


toast.className =
"toast show";



setTimeout(()=>{


toast.className =
"toast";


},3000);


}







// =====================================
// SEARCH
// =====================================


function searchMarketplace(){


const input =
document.getElementById(
"searchInput"
);



if(!input) return;



const query =
input.value.trim();



if(!query){


showToast(
"Enter a product to search"
);


return;


}



window.location.href =

`/marketplace/browse.html?search=${encodeURIComponent(query)}`;


}







// =====================================
// PRODUCTS API
// =====================================


async function loadProducts(){


try{


const response =

await fetch(

`${API_URL}/products`

);



const data =
await response.json();



if(!data.success){

throw new Error(
"Unable to load products"
);

}



renderProducts(
data.products
);



}

catch(error){


console.error(
error
);


showToast(
"Failed loading products"
);


}


}





function renderProducts(products){


const container =

document.getElementById(
"products"
);



if(!container) return;



container.innerHTML="";



products.forEach(product=>{


container.innerHTML += `


<div class="product-card">


<img

src="${product.imageUrl || '/assets/default.png'}"

alt="${product.title}"

>


<div class="product-content">


<h3>
${product.title}
</h3>


<p>
${product.description || ""}
</p>


<strong>
$${product.price}
</strong>



<button

onclick="addToCart(${JSON.stringify(product).replace(/"/g,'&quot;')})"

class="btn">

Add Cart

</button>



<button

onclick="viewProduct('${product.id}')"

class="outline">

View

</button>



</div>


</div>


`;



});


}









// =====================================
// CART SYSTEM
// =====================================


function getCart(){


return JSON.parse(

localStorage.getItem(
"halo_cart"

)

) || [];


}




function addToCart(product){


let cart =
getCart();



const exists =

cart.find(

item =>
item.id === product.id

);



if(exists){


exists.quantity++;


}else{


cart.push({

id:product.id,

title:product.title,

price:product.price,

image:product.imageUrl,

quantity:1


});


}



localStorage.setItem(

"halo_cart",

JSON.stringify(cart)

);



showToast(

`${product.title} added to cart`

);



updateCartCount();


}






function removeCartItem(id){


let cart =
getCart();



cart = cart.filter(

item =>
item.id !== id

);



localStorage.setItem(

"halo_cart",

JSON.stringify(cart)

);


showToast(
"Item removed"
);


}






function cartCount(){


return getCart().length;


}




function updateCartCount(){


const element =

document.getElementById(
"cartCount"
);



if(element){


element.textContent =
cartCount();


}


}









// =====================================
// WISHLIST
// =====================================


function getWishlist(){


return JSON.parse(

localStorage.getItem(
"halo_wishlist"

)

) || [];


}




function toggleWishlist(product){


let wishlist =
getWishlist();



const exists =

wishlist.find(

item =>
item.id === product.id

);




if(exists){


wishlist = wishlist.filter(

item =>
item.id !== product.id

);


showToast(
"Removed from wishlist"
);



}else{


wishlist.push(product);


showToast(
"Added to wishlist"
);


}




localStorage.setItem(

"halo_wishlist",

JSON.stringify(wishlist)

);



}









// =====================================
// AUTH
// =====================================


function getUser(){


return JSON.parse(

localStorage.getItem(
"halo_user"

)

) || null;


}





function checkUser(){


const user =
getUser();



if(user){


console.log(
"Logged in:",
user.email

);


return true;


}



console.log(
"Guest user"
);



return false;


}









// =====================================
// PRODUCT NAVIGATION
// =====================================


function viewProduct(id){


window.location.href =

`/marketplace/product.html?id=${id}`;


}






function openStore(id){


window.location.href =

`/marketplace/vendor.html?id=${id}`;


}








// =====================================
// CHECKOUT
// =====================================


async function checkout(){


const cart =
getCart();



if(cart.length===0){


showToast(
"Your cart is empty"
);


return;


}





try{


const response =

await fetch(

`${API_URL}/orders`,

{

method:"POST",

headers:{


"Content-Type":
"application/json"


},


body:JSON.stringify({

items:cart


})


}

);





const data =
await response.json();





if(data.success){


window.location.href =

`/checkout/checkout.html?order=${data.orderId}`;



}



}

catch(error){


showToast(
"Checkout failed"
);


}


}









// =====================================
// MOBILE MENU
// =====================================


function toggleMenu(){


const nav =

document.querySelector(
"nav"

);



if(nav){


nav.classList.toggle(
"open"

);


}


}









// =====================================
// INIT
// =====================================


document.addEventListener(

"DOMContentLoaded",

()=>{


loadProducts();


checkUser();


updateCartCount();


}

);