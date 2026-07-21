import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";



async function getSellerListings(){


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
data:products,
error

}= await supabase

.from("products")

.select(`
id,
title,
price,
image,
slug,
status,
created_at
`)

.eq(
"seller_id",
user.id
)

.order(
"created_at",
{
ascending:false
}
);






if(error){

console.log(error);

return [];

}



return products || [];

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

title:"Seller Dashboard | Halo Marketplace",

description:
"Manage your Halo Marketplace listings."

};







export default async function SellerDashboard(){


const products = await getSellerListings();





return (

<main className="
min-h-screen
bg-gray-50
px-6
py-16
">



<div className="
mx-auto
max-w-7xl
">





{/* HEADER */}



<div className="
flex
flex-col
justify-between
gap-6
md:flex-row
md:items-center
">


<div>


<h1 className="
text-5xl
font-black
">

Seller Dashboard

</h1>



<p className="
mt-3
text-gray-600
">

Manage your Halo Marketplace store.

</p>



</div>




<Link

href="/sell"

className="
rounded-xl
bg-black
px-8
py-4
font-bold
text-white
"

>

+ Create Listing

</Link>



</div>







{/* STATS */}



<div className="
mt-12
grid
gap-6
md:grid-cols-4
">



<div className="
rounded-3xl
bg-white
p-8
shadow-sm
">

<p className="text-gray-500">

Listings

</p>


<h2 className="
mt-3
text-4xl
font-black
">

{products.length}

</h2>


</div>






<div className="
rounded-3xl
bg-white
p-8
shadow-sm
">

<p className="text-gray-500">

Active

</p>


<h2 className="
mt-3
text-4xl
font-black
">

{
products.filter(
p=>p.status==="active"
).length
}

</h2>


</div>







<div className="
rounded-3xl
bg-white
p-8
shadow-sm
">

<p className="text-gray-500">

Sales

</p>


<h2 className="
mt-3
text-4xl
font-black
">

0

</h2>


</div>







<div className="
rounded-3xl
bg-white
p-8
shadow-sm
">

<p className="text-gray-500">

Revenue

</p>


<h2 className="
mt-3
text-4xl
font-black
">

$0

</h2>


</div>




</div>









{/* LISTINGS */}



<section className="
mt-16
">


<div className="
mb-8
flex
justify-between
items-center
">


<h2 className="
text-3xl
font-black
">

My Listings

</h2>



<Link

href="/sell"

className="
font-bold
text-indigo-600
"

>

Add Product →

</Link>



</div>







{
products.length === 0 ? (



<div className="
rounded-3xl
bg-white
p-16
text-center
">


<div className="text-7xl">

🏪

</div>



<h3 className="
mt-5
text-3xl
font-black
">

No Listings Yet

</h3>



<p className="
mt-3
text-gray-600
">

Create your first product and start selling.

</p>



<Link

href="/sell"

className="
mt-6
inline-block
rounded-xl
bg-black
px-6
py-3
font-bold
text-white
"

>

Create Listing

</Link>



</div>



):(



<div className="
grid
gap-8
sm:grid-cols-2
lg:grid-cols-4
">



{

products.map(product=>(



<div

key={product.id}

className="
overflow-hidden
rounded-3xl
bg-white
shadow-sm
"

>



<div className="
relative
h-52
bg-gray-100
">


{

product.image ? (


<Image

src={product.image}

alt={product.title}

fill

className="
object-cover
"

/>


):(


<div className="
flex
h-full
items-center
justify-center
text-6xl
">

📦

</div>


)

}


</div>







<div className="p-6">


<h3 className="
font-black
truncate
">

{product.title}

</h3>




<p className="
mt-3
text-xl
font-black
text-indigo-600
">

{formatPrice(product.price)}

</p>





<span className="
mt-3
inline-block
rounded-full
bg-gray-100
px-3
py-1
text-sm
capitalize
">

{product.status || "active"}

</span>








<div className="
mt-6
space-y-3
">



<Link

href={`/product/${product.slug}`}

className="
block
rounded-xl
border
py-3
text-center
font-bold
"

>

View Listing

</Link>




<Link

href={`/seller/edit/${product.id}`}

className="
block
rounded-xl
bg-black
py-3
text-center
font-bold
text-white
"

>

Edit Listing

</Link>



</div>





</div>



</div>



))

}



</div>



)

}



</section>






</div>



</main>

);

}