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
  } = await supabase.auth.getUser();



  if(!user){

    redirect("/login");

  }



  const {
    data:favorites,
    error
  } = await supabase

  .from("favorites")

  .select("product_id, created_at")

  .eq("user_id", user.id)

  .order("created_at", {
    ascending:false
  });



  if(error){

    console.log("Favorites error:", error);

    return [];

  }



  if(!favorites || favorites.length === 0){

    return [];

  }



  const productIds = favorites.map(
    favorite => favorite.product_id
  );



  const {
    data:products,
    error:productError
  } = await supabase

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

  .in("id", productIds);



  if(productError){

    console.log("Products error:", productError);

    return [];

  }



  return products || [];

}





export const metadata = {

  title:"My Favorites | Halo Marketplace",

  description:
  "View your saved listings on Halo Marketplace."

};







export default async function FavoritesPage(){


const products = await getFavorites();





return (

<main className="min-h-screen bg-gray-50">



<section className="
bg-black
text-white
py-16
px-6
">


<div className="
max-w-6xl
mx-auto
">


<h1 className="
text-5xl
font-black
">

❤️ My Favorites

</h1>


<p className="
mt-4
text-gray-300
text-lg
">

Listings you saved for later.

</p>


</div>


</section>







<section className="
max-w-6xl
mx-auto
px-6
py-12
">





{
products.length === 0 ? (


<div className="
bg-white
rounded-3xl
p-12
text-center
shadow
">


<h2 className="
text-3xl
font-bold
">

No favorites yet

</h2>


<p className="
mt-4
text-gray-500
">

Browse Halo Marketplace and save listings you like.

</p>



<Link

href="/browse"

className="
inline-block
mt-6
rounded-xl
bg-black
px-8
py-3
font-bold
text-white
"

>

Browse Listings

</Link>


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

products.map((product)=>(


<Link

key={product.id}

href={`/product/${product.slug}`}

className="
overflow-hidden
rounded-2xl
bg-white
shadow-sm
transition
hover:shadow-xl
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

sizes="
(max-width:768px) 100vw,
25vw
"

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


<h2 className="
truncate
text-lg
font-bold
">

{product.title}

</h2>



<p className="
mt-3
text-2xl
font-black
">

${Number(product.price).toLocaleString("en-CA")}

</p>




<p className="
mt-2
text-sm
text-gray-500
">

📍 {product.location || "Canada"}

</p>




{

product.category && (


<span className="
mt-4
inline-block
rounded-full
bg-gray-100
px-3
py-1
text-sm
font-medium
">

{product.category}

</span>


)

}



</div>



</Link>


))


}



</div>


)

}



</section>



</main>

);

}