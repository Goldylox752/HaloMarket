import { redirect, notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import Link from "next/link";



async function getProduct(id){


const supabase = await createClient();



const {

data,

error

}=await supabase

.from("products")

.select(`

*,

profiles:seller_id(

username

)

`)

.eq("id",id)

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

}=await supabase.auth.getUser();





if(!user){

redirect("/login");

}





async function createOrder(){


"use server";



const supabase = await createClient();




const {

data:{
user

}

}=await supabase.auth.getUser();





if(!user){

redirect("/login");

}







await supabase

.from("orders")

.insert({

buyer_id:user.id,

seller_id:product.seller_id,

product_id:product.id,

amount:product.price,

status:"pending"

});





redirect("/dashboard");

}





return (


<main className="min-h-screen bg-gray-50 py-16 px-6">



<div className="max-w-3xl mx-auto">



<div className="bg-white rounded-3xl shadow p-10">





<h1 className="text-4xl font-bold">

Checkout

</h1>



<p className="text-gray-500 mt-2">

Review your order before purchasing.

</p>







<div className="border rounded-2xl p-6 mt-8">



<h2 className="text-2xl font-bold">

{product.title}

</h2>




<p className="text-indigo-600 text-3xl font-black mt-3">

{formatPrice(product.price)}

</p>




<p className="mt-3 text-gray-500">

Seller:

{" "}

{product.profiles?.username || "Seller"}

</p>



<p className="text-gray-500">

📍 {product.location}

</p>



</div>








<form

action={createOrder}

className="mt-8"

>


<button

className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-4 rounded-xl text-lg font-bold"

>

Place Order

</button>


</form>





<Link

href={`/products/${product.id}`}

className="block text-center mt-5 text-gray-500"

>

← Back to Product

</Link>




</div>



</div>



</main>


)


}
