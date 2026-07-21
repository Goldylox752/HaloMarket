import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { createClient } from "@/lib/supabase/server";
import BuyButton from "@/components/BuyButton";



async function getProduct(slug){

  const supabase = await createClient();


  const {
    data,
    error
  } = await supabase

  .from("products")

  .select(`
    id,
    title,
    price,
    image,
    description,
    location,
    category,
    slug,
    seller_id,
    status,
    created_at
  `)

  .eq(
    "slug",
    slug
  )

  .single();



  if(error || !data){

    return null;

  }


  return data;

}





async function getSeller(id){

  if(!id) return null;


  const supabase =
  await createClient();



  const {
    data,
    error
  } = await supabase

  .from("profiles")

  .select(`
    id,
    username,
    avatar,
    verified,
    seller_rating,
    sales_count,
    location
  `)

  .eq(
    "id",
    id
  )

  .single();



  if(error){

    return null;

  }


  return data;

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






export async function generateMetadata({params}){


const {slug}=await params;


const product =
await getProduct(slug);



return {

title:

product

?

`${product.title} | Halo Marketplace`

:

"Halo Marketplace"

};

}







export default async function ProductPage({params}){


const {slug}=await params;



const product =
await getProduct(slug);



if(!product){

notFound();

}



const seller =
await getSeller(
product.seller_id
);







return (

<main className="
min-h-screen
bg-gray-50
px-6
py-12
">



<div className="
mx-auto
grid
max-w-7xl
gap-10
lg:grid-cols-3
">






{/* IMAGE + DETAILS */}



<section className="
lg:col-span-2
">


<div className="
relative
h-[500px]
overflow-hidden
rounded-3xl
bg-white
">


{

product.image ?

<Image

src={product.image}

alt={product.title}

fill

priority

className="
object-cover
"

/>

:

<div className="
flex
h-full
items-center
justify-center
text-7xl
">

📦

</div>

}


</div>







<div className="
mt-8
rounded-3xl
bg-white
p-8
">



<div className="
flex
justify-between
items-center
">


<span className="
rounded-full
bg-gray-100
px-4
py-2
text-sm
font-bold
">

{product.category || "General"}

</span>


<span className="
text-sm
text-gray-500
">

🛡️ Buyer Protection

</span>


</div>






<h1 className="
mt-6
text-5xl
font-black
">

{product.title}

</h1>





<p className="
mt-4
text-gray-500
">

📍 {product.location || "Canada"}

</p>





<p className="
mt-6
text-5xl
font-black
">

{formatPrice(product.price)}

</p>







<div className="
mt-8
">

<BuyButton

productId={product.id}

/>

</div>






<div className="
mt-8
border-t
pt-8
">


<h2 className="
text-2xl
font-black
">

Description

</h2>


<p className="
mt-4
leading-relaxed
text-gray-700
">

{product.description ||
"No description provided."}

</p>


</div>



</div>



</section>








{/* SELLER CARD */}



<aside className="
h-fit
rounded-3xl
bg-white
p-8
shadow-sm
">



<h2 className="
text-2xl
font-black
">

Seller

</h2>





<div className="
mt-6
flex
items-center
gap-4
">



{

seller?.avatar ?

<Image

src={seller.avatar}

width={64}

height={64}

alt="Seller"

className="
rounded-full
"

/>

:

<div className="
flex
h-16
w-16
items-center
justify-center
rounded-full
bg-gray-200
text-2xl
">

👤

</div>

}




<div>

<h3 className="
text-xl
font-black
">

{seller?.username || "Halo Seller"}

</h3>



{

seller?.verified && (

<span className="
inline-block
mt-2
rounded-full
bg-green-100
px-3
py-1
text-xs
font-bold
text-green-700
">

✓ Verified Seller

</span>

)

}


</div>


</div>







<div className="
mt-6
rounded-2xl
bg-gray-100
p-5
space-y-2
">


<p>
⭐ {seller?.seller_rating || "New"} Rating
</p>


<p>
🛒 {seller?.sales_count || 0} Sales
</p>


<p>
📍 {seller?.location || product.location || "Canada"}
</p>


</div>








<Link

href={`/messages?seller=${seller?.id}`}

className="
mt-6
block
rounded-xl
bg-black
px-6
py-4
text-center
font-bold
text-white
"

>

💬 Message Seller

</Link>







<Link

href={`/seller/${seller?.id}`}

className="
mt-3
block
rounded-xl
border
px-6
py-4
text-center
font-bold
"

>

🏪 View Store

</Link>






</aside>





</div>


</main>

);


}