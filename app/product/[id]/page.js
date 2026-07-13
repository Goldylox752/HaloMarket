import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/lib/supabase/server";



async function getProducts(searchParams){


const supabase = await createClient();


let query = supabase
.from("products")
.select("*")
.order("created_at",{ascending:false});



if(searchParams?.search){

query=query.ilike(
"title",
`%${searchParams.search}%`
);

}



if(searchParams?.category){

query=query.eq(
"category",
searchParams.category
);

}



const {data,error}=await query;



if(error){

console.log(error);

return [];

}



return data || [];

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




export default async function ProductsPage({
searchParams
}){


const products = await getProducts(
await searchParams
);



return (

<main className="min-h-screen bg-gray-50 py-12 px-6">



<div className="max-w-7xl mx-auto">



{/* HEADER */}


<div className="flex flex-col md:flex-row justify-between gap-5 mb-10">


<div>


<h1 className="text-5xl font-bold">

Halo Marketplace

</h1>


<p className="text-gray-500 mt-3">

Buy and sell anything across Canada.

</p>


</div>




<Link

href="/sell"

className="bg-indigo-600 text-white px-8 py-4 rounded-xl font-bold"

>

+ Sell Item

</Link>



</div>






{/* SEARCH */}


<form className="bg-white p-5 rounded-2xl shadow mb-10">


<input

name="search"

placeholder="Search products..."

className="w-full border rounded-xl p-4"

/>


</form>







{/* PRODUCTS */}



{products.length === 0 ? (


<div className="bg-white rounded-3xl p-10 text-center">

<h2 className="text-2xl font-bold">

No listings found

</h2>


<p className="text-gray-500 mt-2">

Be the first seller on Halo.

</p>


</div>



):(



<div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">


{products.map((product)=>(


<Link

href={`/products/${product.id}`}

key={product.id}

className="bg-white rounded-3xl shadow hover:shadow-xl transition overflow-hidden"

>




<div className="h-60 bg-gray-100">


{product.image ? (


<Image

src={product.image}

alt={product.title}

width={500}

height={400}

className="w-full h-full object-cover"

/>



):(


<div className="h-full flex items-center justify-center text-7xl">

📦

</div>


)}



</div>








<div className="p-5">



<h2 className="font-bold text-xl line-clamp-2">

{product.title}

</h2>




<p className="text-indigo-600 text-2xl font-bold mt-3">

{formatPrice(product.price)}

</p>





<p className="text-gray-500 mt-2">

📍 {product.location || "Canada"}

</p>





<p className="text-sm text-gray-400 mt-3">

{product.condition || "Used"}

</p>



</div>




</Link>



))}



</div>


)}



</div>



</main>

)

}
