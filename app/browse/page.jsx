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
      slug,
      category
    `)
    .order("created_at", {
      ascending:false
    });


  if(error){
    console.log(error);
    return [];
  }


  return products || [];

}




export const metadata = {

title:"Browse Listings | Halo Marketplace",

description:
"Browse products for sale on Halo Marketplace."

};




export default async function BrowsePage(){


const products = await getProducts();



return (

<main className="min-h-screen bg-gray-50">


{/* HEADER */}

<section className="bg-black text-white py-14 px-6">


<div className="max-w-6xl mx-auto">


<h1 className="text-5xl font-bold">

Browse Marketplace

</h1>


<p className="mt-4 text-gray-300">

Find products from sellers near you.

</p>


</div>


</section>





{/* SEARCH + FILTER */}

<section className="
max-w-6xl
mx-auto
px-6
py-10
">


<div className="
bg-white
rounded-2xl
shadow
p-6
grid
md:grid-cols-3
gap-4
">


<input

placeholder="Search listings..."

className="
border
rounded-xl
px-5
py-3
"

/>



<select

className="
border
rounded-xl
px-5
py-3
"

>

<option>
All Categories
</option>

<option>
Electronics
</option>

<option>
Vehicles
</option>

<option>
Home
</option>

<option>
Gaming
</option>

<option>
Other
</option>

</select>




<select

className="
border
rounded-xl
px-5
py-3
"

>

<option>
Any Location
</option>

<option>
Alberta
</option>

<option>
Ontario
</option>

<option>
British Columbia
</option>


</select>



</div>


</section>






{/* LISTINGS */}

<section className="
max-w-6xl
mx-auto
px-6
pb-20
">


<div className="
grid
grid-cols-1
sm:grid-cols-2
lg:grid-cols-4
gap-6
">


{products.map((product)=>(


<Link

key={product.id}

href={`/product/${product.slug}`}

className="
bg-white
rounded-2xl
overflow-hidden
shadow-sm
hover:shadow-xl
transition
"


>


<div className="
relative
h-56
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
h-full
flex
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


<h2 className="
font-bold
text-lg
line-clamp-1
">

{product.title}

</h2>



<p className="
text-gray-500
text-sm
mt-2
">

{product.location}

</p>




<p className="
font-bold
text-xl
mt-4
">

${product.price}

</p>




{
product.category && (

<span className="
inline-block
mt-3
bg-gray-100
px-3
py-1
rounded-full
text-sm
">

{product.category}

</span>

)

}



</div>



</Link>


))}



</div>



{
products.length === 0 && (

<div className="
text-center
py-20
text-gray-500
">

No listings found yet.

</div>

)

}



</section>






</main>

);


}