import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";



async function getFavorites(){

const supabase = await createClient();



const {
data:{
user
}
}=await supabase.auth.getUser();



if(!user){

redirect("/login");

}




const {
data,
error
}=await supabase

.from("favorites")

.select(`
created_at,

products(
id,
title,
price,
image,
location,
slug,
category,
seller_id,

profiles(
username,
avatar,
verified
)

)

`)

.eq(
"user_id",
user.id
)

.order(
"created_at",
{
ascending:false
}
);





if(error){

console.error(error);

return [];

}




return data
?.map(item=>item.products)
.filter(Boolean)
||
[];

}








export const metadata={

title:
"Favorites | Halo Marketplace",

description:
"Saved listings on Halo Marketplace."

};









export default async function FavoritesPage(){


const products =
await getFavorites();




return (

<main className="
min-h-screen
bg-gray-50
">





<section className="
bg-black
px-6
py-16
text-white
">


<div className="
mx-auto
max-w-7xl
">


<h1 className="
text-5xl
font-black
">

❤️ Saved Listings

</h1>


<p className="
mt-4
text-gray-300
">

Your favorite Halo Marketplace items.

</p>


</div>


</section>








<section className="
mx-auto
max-w-7xl
px-6
py-12
">





{
products.length === 0 ? (


<div className="
rounded-3xl
bg-white
p-12
text-center
">


<h2 className="
text-3xl
font-black
">

No favorites yet

</h2>


<p className="
mt-3
text-gray-500
">

Save products you want to come back to.

</p>



<Link

href="/browse"

className="
mt-6
inline-block
rounded-xl
bg-black
px-8
py-3
font-bold
text-white
"

>

Browse Products

</Link>



</div>



):(




<div className="
grid
gap-6
sm:grid-cols-2
lg:grid-cols-4
">



{products.map(product=>(


<Link

key={product.id}

href={`/product/${product.slug}`}

className="
group
overflow-hidden
rounded-3xl
bg-white
transition
hover:-translate-y-1
hover:shadow-xl
"

>



<div className="
relative
h-60
bg-gray-100
">



{product.image ? (

<Image

src={product.image}

alt={product.title}

fill

sizes="300px"

className="
object-cover
transition
group-hover:scale-105
"

/>

):(


<div className="
flex
h-full
items-center
justify-center
text-5xl
">

📦

</div>

)}



</div>







<div className="
p-5
">


<span className="
rounded-full
bg-gray-100
px-3
py-1
text-xs
font-bold
">

{product.category || "General"}

</span>





<h2 className="
mt-4
truncate
text-lg
font-black
">

{product.title}

</h2>






<p className="
mt-3
text-2xl
font-black
">

{new Intl.NumberFormat(
"en-CA",
{
style:"currency",
currency:"CAD"
}
).format(product.price)}

</p>






<p className="
mt-2
text-sm
text-gray-500
">

📍 {product.location || "Canada"}

</p>








<div className="
mt-5
flex
items-center
gap-3
border-t
pt-4
">


{product.profiles?.avatar ? (

<Image

src={product.profiles.avatar}

alt="seller"

width={32}

height={32}

className="
rounded-full
"

/>

):(


<div className="
h-8
w-8
rounded-full
bg-gray-200
">

</div>

)}





<div>


<p className="
text-sm
font-bold
">

{product.profiles?.username || "Seller"}

</p>



{product.profiles?.verified && (

<p className="
text-xs
font-bold
text-green-600
">

✓ Verified Seller

</p>

)}


</div>



</div>





</div>


</Link>


))}


</div>



)



}




</section>





</main>

);

}