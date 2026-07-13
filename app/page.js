import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";



async function getDashboardData(){


const supabase = await createClient();



const {
data:{
user
}

}=await supabase.auth.getUser();



if(!user){

redirect("/login");

}





const {data:profile}=await supabase

.from("profiles")

.select("*")

.eq("id",user.id)

.single();






const {data:products}=await supabase

.from("products")

.select("*")

.eq("seller_id",user.id)

.order(
"created_at",
{
ascending:false
}
);






const {data:favorites}=await supabase

.from("favorites")

.select("*")

.eq("user_id",user.id);





return {

user,

profile,

products:products || [],

favorites:favorites || []

};


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





export default async function DashboardPage(){


const {

user,

profile,

products,

favorites

}=await getDashboardData();





return (

<main className="min-h-screen bg-gray-50 py-12 px-6">


<div className="max-w-7xl mx-auto">





{/* HEADER */}


<section className="bg-white rounded-3xl shadow p-8">


<div className="flex flex-col md:flex-row items-center gap-6">



<Image

src={
profile?.avatar ||
"/avatar.png"
}

alt="profile"

width={100}

height={100}

className="rounded-full"

/>




<div>


<h1 className="text-4xl font-bold">

Welcome back,

{" "}

{profile?.username || "Seller"}

</h1>



<p className="text-gray-500 mt-2">

{user.email}

</p>




<p className="mt-3">

📍 {profile?.location || "Canada"}

</p>


</div>



</div>



</section>







{/* STATS */}


<section className="grid md:grid-cols-3 gap-6 mt-8">


<div className="bg-white rounded-3xl shadow p-6">


<h3 className="text-gray-500">

Listings

</h3>


<p className="text-4xl font-bold mt-2">

{products.length}

</p>


</div>





<div className="bg-white rounded-3xl shadow p-6">


<h3 className="text-gray-500">

Favorites

</h3>


<p className="text-4xl font-bold mt-2">

{favorites.length}

</p>


</div>





<div className="bg-white rounded-3xl shadow p-6">


<h3 className="text-gray-500">

Seller Rating

</h3>


<p className="text-4xl font-bold mt-2">

⭐ {profile?.rating || "5.0"}

</p>


</div>



</section>








{/* ACTIONS */}


<section className="grid md:grid-cols-3 gap-6 mt-8">


<Link

href="/sell"

className="bg-indigo-600 text-white rounded-2xl p-6 font-bold text-xl"

>

+ Create Listing

</Link>




<Link

href="/messages"

className="bg-black text-white rounded-2xl p-6 font-bold text-xl"

>

💬 Messages

</Link>





<Link

href="/favorites"

className="bg-white shadow rounded-2xl p-6 font-bold text-xl"

>

❤️ Favorites

</Link>



</section>








{/* MY PRODUCTS */}



<section className="mt-12">


<h2 className="text-3xl font-bold mb-6">

My Listings

</h2>





{products.length === 0 ? (


<div className="bg-white rounded-3xl p-8">

You have no listings yet.

</div>



):(



<div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">



{products.map((product)=>(


<Link

key={product.id}

href={`/products/${product.id}`}

className="bg-white rounded-3xl shadow overflow-hidden hover:shadow-xl"

>



<div className="h-48 bg-gray-100">


{

product.image ? (


<Image

src={product.image}

alt={product.title}

width={400}

height={300}

className="w-full h-full object-cover"

/>


):(


<div className="flex h-full items-center justify-center text-6xl">

📦

</div>


)

}



</div>







<div className="p-5">


<h3 className="font-bold">

{product.title}

</h3>




<p className="text-indigo-600 font-bold mt-2">

{formatPrice(product.price)}

</p>



</div>



</Link>



))}



</div>



)}



</section>




</div>



</main>

)

}
