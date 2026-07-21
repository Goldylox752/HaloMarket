import Image from "next/image";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";



async function getSeller(id){


const supabase = await createClient();



const {
data:profile,
error

}= await supabase

.from("profiles")

.select(`
id,
username,
avatar,
location,
rating,
review_count,
verified
`)

.eq(
"id",
id
)

.single();





if(error || !profile){

return null;

}





const {
data:products

}= await supabase

.from("products")

.select(`
id,
title,
price,
image,
slug,
category
`)

.eq(
"seller_id",
id
)

.eq(
"status",
"active"
)

.order(
"created_at",
{
ascending:false
}
);





return {

profile,

products: products || []

};


}







export async function generateMetadata({params}){


const {id}= await params;


const seller = await getSeller(id);



return {

title:
seller
? `${seller.profile.username} | Halo Marketplace`
:"Seller Not Found"

};


}







export default async function SellerPage({params}){


const {id}= await params;


const seller = await getSeller(id);





if(!seller){

notFound();

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
max-w-6xl
">





{/* PROFILE */}



<section className="
rounded-3xl
bg-white
p-10
shadow
">


<div className="
flex
items-center
gap-6
">


{
seller.profile.avatar ? (

<Image

src={seller.profile.avatar}

width={90}

height={90}

alt="Seller"

className="
rounded-full
"

/>


):(

<div className="
flex
h-24
w-24
items-center
justify-center
rounded-full
bg-gray-200
text-4xl
">

👤

</div>

)

}





<div>


<h1 className="
text-4xl
font-black
">

{seller.profile.username || "Halo Seller"}

</h1>



<p className="
mt-2
text-gray-600
">

📍 {seller.profile.location || "Canada"}

</p>



<p className="
mt-2
font-bold
">

⭐ {seller.profile.rating || "5.0"}

({seller.profile.review_count || 0} reviews)

</p>



</div>





{
seller.profile.verified && (

<span className="
rounded-full
bg-green-100
px-4
py-2
font-bold
text-green-700
">

✓ Verified

</span>

)

}



</div>


</section>







{/* PRODUCTS */}



<section className="
mt-12
">


<h2 className="
mb-8
text-3xl
font-black
">

Seller Listings

</h2>





<div className="
grid
gap-6
sm:grid-cols-2
lg:grid-cols-4
">



{

seller.products.map(product=>(


<Link

key={product.id}

href={`/product/${product.slug}`}

className="
overflow-hidden
rounded-2xl
bg-white
shadow
hover:shadow-xl
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

className="object-cover"

/>


):(


<div className="
flex
h-full
items-center
justify-center
">

📦

</div>


)

}



</div>






<div className="p-5">


<h3 className="
font-bold
truncate
">

{product.title}

</h3>



<p className="
mt-3
text-xl
font-black
">

${product.price}

</p>



</div>



</Link>


))


}



</div>



</section>




</div>


</main>

);

}