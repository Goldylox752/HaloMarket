import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";


async function getDashboardData() {

  const supabase = await createClient();


  const {
    data:{
      user
    }
  } = await supabase.auth.getUser();



  if(!user){
    redirect("/login");
  }



  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();



  const { data: products } = await supabase
    .from("products")
    .select("*")
    .eq("seller_id", user.id)
    .order("created_at", {
      ascending:false
    });



  const { data: favorites } = await supabase
    .from("favorites")
    .select("*")
    .eq("user_id", user.id);



  return {
    user,
    profile,
    products: products ?? [],
    favorites: favorites ?? []
  };

}



function formatPrice(price:number){

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

<main className="min-h-screen bg-gray-50 px-6 py-12">

<div className="max-w-7xl mx-auto">


<section className="bg-white rounded-3xl shadow p-8">


<div className="flex items-center gap-6">


<Image

src={
profile?.avatar ??
"/avatar.png"
}

alt="Profile"

width={100}

height={100}

className="rounded-full"

/>



<div>

<h1 className="text-4xl font-bold">

Welcome back {profile?.username ?? "Seller"}

</h1>


<p className="text-gray-500">
{user.email}
</p>


<p className="mt-2">
📍 {profile?.location ?? "Canada"}
</p>


</div>


</div>


</section>





<section className="grid md:grid-cols-3 gap-6 mt-8">


<div className="bg-white rounded-3xl shadow p-6">

<p className="text-gray-500">
Listings
</p>

<h2 className="text-4xl font-bold">
{products.length}
</h2>

</div>



<div className="bg-white rounded-3xl shadow p-6">

<p className="text-gray-500">
Favorites
</p>

<h2 className="text-4xl font-bold">
{favorites.length}
</h2>

</div>




<div className="bg-white rounded-3xl shadow p-6">

<p className="text-gray-500">
Rating
</p>

<h2 className="text-4xl font-bold">
⭐ {profile?.rating ?? "5.0"}
</h2>

</div>



</section>





<section className="grid md:grid-cols-3 gap-6 mt-8">


<Link
href="/sell/create"
className="bg-indigo-600 text-white rounded-2xl p-6 text-xl font-bold"
>

+ Create Listing

</Link>



<Link
href="/messages"
className="bg-black text-white rounded-2xl p-6 text-xl font-bold"
>

💬 Messages

</Link>



<Link
href="/favorites"
className="bg-white shadow rounded-2xl p-6 text-xl font-bold"
>

❤️ Favorites

</Link>


</section>






<section className="mt-12">


<h2 className="text-3xl font-bold mb-6">
My Listings
</h2>



{
products.length === 0 ? (

<div className="bg-white rounded-3xl p-8">

No listings yet.

</div>

)

:

(

<div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">


{
products.map((product)=>(


<Link

key={product.id}

href={`/products/${product.id}`}

className="bg-white rounded-3xl shadow overflow-hidden"

>


<div className="h-48">


{
product.image ?

<Image

src={product.image}

alt={product.title}

width={400}

height={300}

className="w-full h-full object-cover"

/>

:

<div className="flex items-center justify-center h-full text-5xl">

📦

</div>

}


</div>



<div className="p-5">

<h3 className="font-bold">
{product.title}
</h3>


<p className="text-indigo-600 font-bold">

{formatPrice(product.price)}

</p>


</div>


</Link>


))

}


</div>

)

}



</section>


</div>


</main>

)

}