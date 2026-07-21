import Image from "next/image";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";



async function getProducts(search){


const supabase = await createClient();



let query = supabase

.from("products")

.select(`
id,
title,
price,
image,
location,
slug
`)

.order("created_at", {
ascending:false
})

.limit(12);





if(search){

query = query.ilike(
"title",
`%${search}%`
);

}




const {
data:products,
error
} = await query;





if(error){

console.log(error);

return [];

}



return products || [];

}






export const metadata = {

title:"Halo Marketplace | Buy & Sell Locally",

description:
"Buy, sell, and discover products on Halo Marketplace."

};







export default async function Home({searchParams}){


const search = searchParams?.search || "";


const products = await getProducts(search);





return (

<main className="min-h-screen bg-white">





{/* HERO */}



<section className="
bg-black
text-white
py-20
px-6
">


<div className="
max-w-6xl
mx-auto
">


<h1 className="
text-5xl
md:text-6xl
font-bold
">

Halo Marketplace

</h1>



<p className="
mt-5
max-w-2xl
text-xl
text-gray-300
">

Buy, sell, and discover products from people near you.

</p>





<div className="
flex
gap-4
mt-8
">


<Link

href="/sell"

className="
rounded-xl
bg-white
px-6
py-3
font-semibold
text-black
"

>

Sell Something

</Link>




<Link

href="/browse"

className="
rounded-xl
border
border-white
px-6
py-3
font-semibold
"

>

Browse Listings

</Link>



</div>



</div>


</section>









{/* SEARCH */}



<section className="
max-w-6xl
mx-auto
px-6
-mt-8
">


<form

action="/"

className="
rounded-2xl
bg-white
p-6
shadow-xl
flex
gap-3
"

>


<input

name="search"

defaultValue={search}

placeholder="Search products..."

className="
flex-1
rounded-xl
border
px-5
py-4
text-lg
outline-none
"

/>



<button

type="submit"

className="
rounded-xl
bg-black
px-6
text-white
font-semibold
"

>

Search

</button>



</form>


</section>









{/* CATEGORIES */}



<section className="
max-w-6xl
mx-auto
px-6
py-12
">


<h2 className="
mb-6
text-2xl
font-bold
">

Explore Categories

</h2>




<div className="
grid
grid-cols-2
md:grid-cols-4
gap-4
">


{
[
"Electronics",
"Vehicles",
"Home",
"Gaming"
].map(category=>(


<Link

key={category}

href={`/browse?category=${category}`}

className="
rounded-xl
border
p-6
text-center
hover:shadow-lg
"

>

{category}

</Link>


))

}



</div>


</section>









{/* PRODUCTS */}



<section className="
max-w-6xl
mx-auto
px-6
pb-20
">


<div className="
mb-8
flex
justify-between
items-center
">


<h2 className="
text-3xl
font-bold
">

{
search

? `Results for "${search}"`

: "Latest Listings"

}

</h2>



<Link

href="/browse"

className="
text-blue-600
font-semibold
"

>

View All

</Link>



</div>









{
products.length === 0 ? (


<div className="
rounded-2xl
bg-gray-100
p-12
text-center
">


<h3 className="
text-2xl
font-bold
">

No listings found

</h3>


<p className="
mt-3
text-gray-500
">

Try another search.

</p>



</div>



):(



<div className="
grid
grid-cols-1
sm:grid-cols-2
lg:grid-cols-4
gap-6
">


{

products.map(product=>(


<Link

key={product.id}

href={`/product/${product.slug}`}

className="
overflow-hidden
rounded-2xl
border
transition
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

sizes="(max-width:768px)100vw,25vw"

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
text-gray-400
">

No Image

</div>


)

}



</div>







<div className="p-5">


<h3 className="
truncate
text-lg
font-bold
">

{product.title}

</h3>




<p className="
mt-2
text-sm
text-gray-500
">

📍 {product.location || "Canada"}

</p>




<p className="
mt-3
text-xl
font-black
">

${Number(product.price).toLocaleString("en-CA")}

</p>



</div>



</Link>


))


}



</div>



)

}



</section>









{/* SELL CTA */}



<section className="
bg-gray-100
py-16
px-6
text-center
">


<h2 className="
text-3xl
font-bold
">

Ready to sell?

</h2>



<p className="
mt-3
text-gray-600
">

Create your listing and reach buyers today.

</p>



<Link

href="/sell"

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

Post Item

</Link>



</section>





</main>

);

}