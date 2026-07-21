import { redirect, notFound } from "next/navigation";
import Link from "next/link";

import { createClient } from "@/lib/supabase/server";



async function getProduct(id){


const supabase = await createClient();



const {
data,
error

}= await supabase

.from("products")

.select(`
*,
profiles:seller_id(
username
)
`)

.eq(
"id",
id
)

.single();





if(error || !data){

return null;

}


return data;

}






function formatPrice(price){

return new Intl.NumberFormat(
"en-CA",
{
style:"currency",
currency:"CAD"
}
).format(price || 0);

}







export const metadata = {

title:"Checkout | Halo Marketplace",

description:
"Complete your Halo Marketplace purchase."

};








export default async function CheckoutPage({
searchParams
}){


const params = await searchParams;


const productId = params?.product;



if(!productId){

redirect("/products");

}





const product = await getProduct(productId);



if(!product){

notFound();

}






const supabase = await createClient();



const {
data:{
user
}

}= await supabase.auth.getUser();





if(!user){

redirect("/login");

}






if(product.seller_id === user.id){

redirect(
`/product/${product.slug}`
);

}







async function createOrder(){

"use server";



const supabase = await createClient();




const {
data:{
user
}

}= await supabase.auth.getUser();





if(!user){

redirect("/login");

}





const {

error

}= await supabase

.from("orders")

.insert({

buyer_id:user.id,

seller_id:product.seller_id,

product_id:product.id,

amount:product.price,

status:"pending"

});





if(error){

console.log(
"Order error:",
error
);

return;

}





redirect("/dashboard");

}





return (

<main className="
min-h-screen
bg-gray-50
px-6
py-16
">


<div className="
mx-auto
max-w-3xl
">



<div className="
rounded-3xl
bg-white
p-10
shadow
">





<h1 className="
text-4xl
font-black
">

Checkout

</h1>



<p className="
mt-3
text-gray-600
">

Review your order before purchasing.

</p>








<div className="
mt-8
rounded-2xl
border
p-6
">



<h2 className="
text-2xl
font-black
">

{product.title}

</h2>




<p className="
mt-4
text-3xl
font-black
text-indigo-600
">

{formatPrice(product.price)}

</p>




<div className="
mt-5
space-y-2
text-gray-600
">


<p>

👤 Seller:

{" "}

{product.profiles?.username || "Halo Seller"}

</p>



<p>

📍 {product.location || "Canada"}

</p>



<p>

📦 {product.condition || "Used"}

</p>



</div>



</div>








<form

action={createOrder}

className="
mt-8
"

>


<button

className="
w-full
rounded-xl
bg-indigo-600
py-4
text-lg
font-bold
text-white
hover:bg-indigo-700
"

>

Place Order

</button>



</form>








<Link

href={`/product/${product.slug}`}

className="
mt-5
block
text-center
text-gray-500
"

>

← Back to Product

</Link>






</div>


</div>


</main>

);

}