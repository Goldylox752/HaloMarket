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





const {data}=await supabase

.from("favorites")

.select(`

id,

products (

id,

title,

price,

image,

location

)

`)

.eq("user_id",user.id);



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





export default async function FavoritesPage(){


const favorites = await getFavorites();





return (

<main className="min-h-screen bg-gray-50 py-12 px-6">


<div className="max-w-7xl mx-auto">



<h1 className="text-5xl font-bold">

❤️ Saved Listings

</h1>


<p className="text-gray-500 mt-3">

Products you want to come back to.

</p>






{
favorites.length === 0 ? (


<div className="bg-white rounded-3xl shadow p-10 mt-10 text-center">


<h2 className="text-2xl font-bold">

No saved listings yet

</h2>


<Link

href="/products"

className="inline-block mt-5 bg-indigo-600 text-white px-6 py-3 rounded-xl"

>

Browse Marketplace

</Link>


</div>



):(



<div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 mt-10">



{favorites.map((item)=>(


<Link

key={item.id}

href={`/products/${item.products.id}`}

className="bg-white rounded-3xl shadow overflow-hidden hover:shadow-xl"

>



<div className="h-56 bg-gray-100">


{

item.products.image ? (


<Image

src={item.products.image}

alt={item.products.title}

width={400}

height={300}

className="w-full h-full object-cover"

/>


):(


<div className="flex items-center justify-center h-full text-6xl">

📦

</div>


)


}


</div>





<div className="p-5">


<h2 className="font-bold text-lg">

{item.products.title}

</h2>



<p className="text-indigo-600 font-bold text-xl mt-2">

{formatPrice(item.products.price)}

</p>



<p className="text-gray-500 mt-2">

📍 {item.products.location}

</p>



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
