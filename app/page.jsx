import Image from "next/image";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";


async function getProducts(){

  const supabase = await createClient();

  const {data: products, error} = await supabase
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


  if(error){
    console.log(error);
    return [];
  }


  return products || [];

}



export const metadata = {
  title:"Halo Marketplace | Buy & Sell Locally",
  description:
  "Halo Marketplace is a modern marketplace to buy and sell products locally."
};



export default async function Home(){

const products = await getProducts();


return (

<main className="min-h-screen bg-white">


{/* HERO */}

<section className="bg-black text-white py-20 px-6">

<div className="max-w-6xl mx-auto">

<h1 className="text-5xl md:text-6xl font-bold">
Halo Marketplace
</h1>


<p className="mt-5 text-xl text-gray-300 max-w-2xl">
Buy, sell, and discover products from people near you.
A simple marketplace built for everyone.
</p>



<div className="flex gap-4 mt-8">

<Link
href="/sell"
className="
bg-white
text-black
px-6
py-3
rounded-xl
font-semibold
">

Sell Something

</Link>



<Link
href="/browse"
className="
border
border-white
px-6
py-3
rounded-xl
font-semibold
">

Browse Listings

</Link>


</div>

</div>

</section>





{/* SEARCH */}

<section className="max-w-6xl mx-auto px-6 -mt-8">

<div className="
bg-white
shadow-xl
rounded-2xl
p-6
">

<input

placeholder="Search products..."

className="
w-full
border
rounded-xl
px-5
py-4
text-lg
outline-none
"

/>

</div>

</section>





{/* CATEGORIES */}

<section className="max-w-6xl mx-auto px-6 py-12">


<h2 className="text-2xl font-bold mb-6">
Explore Categories
</h2>


<div className="
grid
grid-cols-2
md:grid-cols-4
gap-4
">


{[
"Electronics",
"Vehicles",
"Home",
"Gaming"
].map((cat)=>(

<div
key={cat}
className="
border
rounded-xl
p-6
text-center
hover:shadow-lg
cursor-pointer
"
>

{cat}

</div>

))}


</div>


</section>






{/* PRODUCTS */}

<section className="max-w-6xl mx-auto px-6 pb-20">


<div className="flex justify-between items-center mb-8">

<h2 className="text-3xl font-bold">
Latest Listings
</h2>


<Link
href="/browse"
className="text-blue-600"
>
View All
</Link>


</div>




<div className="
grid
grid-cols-1
sm:grid-cols-2
lg:grid-cols-4
gap-6
">


{
products.map((product)=>(


<Link
href={`/product/${product.slug}`}
key={product.id}

className="
border
rounded-2xl
overflow-hidden
hover:shadow-xl
transition
"
>


<div className="
h-52
bg-gray-100
relative
">


{product.image ? (

<Image

src={product.image}

alt={product.title}

fill

className="object-cover"

/>

):(


<div className="
flex
items-center
justify-center
h-full
text-gray-400
">
No Image
</div>


)}


</div>



<div className="p-5">


<h3 className="
font-bold
text-lg
">

{product.title}

</h3>


<p className="
text-gray-500
mt-2
">

{product.location}

</p>


<p className="
font-bold
text-xl
mt-3
">

${product.price}

</p>



</div>


</Link>


))

}



</div>


</section>





{/* FOOTER CTA */}

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
inline-block
mt-6
bg-black
text-white
px-8
py-3
rounded-xl
"

>

Post Item

</Link>


</section>



</main>

)

}