import Image from "next/image";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";


async function getSeller(id:string){

  const supabase = await createClient();


  const {data:seller,error} = await supabase
    .from("profiles")
    .select(
      `
      id,
      username,
      store_name,
      avatar,
      location,
      rating
      `
    )
    .eq("id",id)
    .single();



  if(error || !seller){
    return null;
  }



  const {data:products}=await supabase
    .from("products")
    .select("*")
    .eq("seller_id",id)
    .order("created_at",{
      ascending:false
    });



  return {
    seller,
    products:products ?? []
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





export default async function SellerPage({
params
}:{
params:{
id:string
}
}){


const data = await getSeller(params.id);



if(!data){
  notFound();
}



const {
seller,
products
}=data;




return (

<main className="min-h-screen bg-gray-50 px-6 py-16">


<div className="max-w-7xl mx-auto">



{/* SELLER PROFILE */}

<section className="bg-white rounded-3xl shadow p-10">


<div className="flex flex-col md:flex-row items-center gap-8">


<Image

src={seller.avatar || "/avatar.png"}

alt={seller.username || "Seller"}

width={120}

height={120}

className="rounded-full"

/>




<div>


<h1 className="text-4xl font-bold">

{seller.store_name || seller.username || "Halo Seller"}

</h1>


<p className="text-gray-600 mt-2">

Seller: {seller.username}

</p>


<p className="mt-3">

📍 {seller.location || "Canada"}

</p>


<p className="mt-3">

⭐ {seller.rating || "5.0"} Rating

</p>


</div>


</div>




<Link

href={`/messages/new?seller=${seller.id}`}

className="inline-block mt-8 bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-4 rounded-xl font-bold"

>

Message Seller

</Link>


</section>







{/* PRODUCTS */}

<section className="mt-12">


<h2 className="text-3xl font-bold mb-8">

Listings by {seller.store_name || seller.username}

</h2>





{
products.length === 0 ?


<div className="bg-white rounded-3xl p-10">

No listings yet.

</div>



:

<div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">


{
products.map((product)=>(


<Link

key={product.id}

href={`/products/${product.id}`}

className="bg-white rounded-3xl shadow overflow-hidden hover:shadow-xl transition"

>


<div className="h-56 bg-gray-100">


{
product.image ?


<Image

src={product.image}

alt={product.title}

width={500}

height={400}

className="w-full h-full object-cover"

/>


:


<div className="flex h-full items-center justify-center text-6xl">

📦

</div>


}


</div>



<div className="p-5">


<h3 className="font-bold">

{product.title}

</h3>



<p className="text-indigo-600 font-bold text-xl mt-2">

{formatPrice(product.price)}

</p>



<p className="text-gray-500 mt-2">

📍 {product.location}

</p>


</div>



</Link>


))

}


</div>

}



</section>


</div>


</main>

);

}