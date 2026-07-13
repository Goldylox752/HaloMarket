import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/lib/supabase/server";



async function getProducts(searchParams){


const supabase = await createClient();



let query = supabase

.from("products")

.select(`

*,

profiles:seller_id(

username,

avatar,

rating

)

`)

.order(
"created_at",
{
ascending:false
}
);





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




const {
data,
error

}=await query;



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
currency:"CAD",
maximumFractionDigits:0
}

).format(price || 0);


}





const categories=[

"Vehicles",

"Electronics",

"Home",

"Fashion",

"Gaming",

"Tools",

"Sports"

];






export default async function ProductsPage({
searchParams
}){


const params = await searchParams;


const products = await getProducts(params);





return (

<main className="min-h-screen bg-gray-50 py-12 px-6">


<div className="max-w-7xl mx-auto">





{/* HEADER */}



<div className="flex flex-col md:flex-row justify-between items-start gap-6 mb-10">



<div>


<h1 className="text-5xl font-black">

Halo Marketplace

</h1>



<p className="text-gray-500 mt-3 text-lg">

Buy and sell anything across Canada.

</p>


</div>




<Link

href="/sell"

className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-4 rounded-xl font-bold"

>

+ Sell Item

</Link>



</div>








{/* SEARCH */}



<form

className="bg-white rounded-3xl shadow p-6 mb-8"

>


<input

name="search"

defaultValue={params?.search || ""}

placeholder="Search MacBooks, cars, phones..."

className="w-full border rounded-xl p-4 text-lg"

/>



</form>








{/* CATEGORIES */}



<div className="flex gap-3 overflow-x-auto mb-10">


{categories.map((category)=>(


<Link

key={category}

href={`/products?category=${category}`}

className="bg-white shadow px-5 py-3 rounded-full whitespace-nowrap hover:bg-indigo-50"

>

{category}

</Link>



))}



</div>










{/* RESULTS */}



<div className="flex justify-between mb-6">


<h2 className="text-3xl font-bold">

Latest Listings

</h2>


<p className="text-gray-500">

{products.length} items

</p>


</div>









{
products.length === 0 ? (


<div className="bg-white rounded-3xl shadow p-12 text-center">


<h2 className="text-3xl font-bold">

No listings found

</h2>



<p className="text-gray-500 mt-3">

Try another search or create the first listing.

</p>



<Link

href="/sell"

className="inline-block mt-6 bg-indigo-600 text-white px-6 py-3 rounded-xl"

>

Create Listing

</Link>


</div>



):(




<div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">





{products.map((product)=>(



<Link

key={product.id}

href={`/products/${product.id}`}

className="bg-white rounded-3xl shadow hover:shadow-2xl transition overflow-hidden"

>






<div className="h-60 bg-gray-100 relative">


{

product.image ? (



<Image

src={product.image}

alt={product.title}

fill

className="object-cover"

/>



):(



<div className="h-full flex items-center justify-center text-7xl">

📦

</div>


)

}


</div>









<div className="p-5">





<h3 className="font-bold text-xl line-clamp-2">

{product.title}

</h3>





<p className="text-indigo-600 text-2xl font-black mt-3">

{formatPrice(product.price)}

</p>





<div className="text-gray-500 mt-3 space-y-1">


<p>

📍 {product.location || "Canada"}

</p>



<p>

{product.condition || "Used"}

</p>



</div>








<div className="border-t mt-5 pt-4 flex items-center gap-3">



<Image

src={
product.profiles?.avatar ||
"/avatar.png"
}

alt="seller"

width={35}

height={35}

className="rounded-full"

/>





<div>


<p className="text-sm font-semibold">

{
product.profiles?.username ||
"Seller"

}

</p>



<p className="text-xs text-gray-500">

⭐ {product.profiles?.rating || "5.0"}

</p>


</div>



</div>




</div>






</Link>



))}




</div>



)

}



</div>


</main>


)

}
