import Image from "next/image";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";



async function getProducts(search, category, location){

  const supabase = await createClient();



  let query = supabase

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





  if(search){

    query = query.ilike(
      "title",
      `%${search}%`
    );

  }





  if(category){

    query = query.eq(
      "category",
      category
    );

  }





  if(location){

    query = query.ilike(
      "location",
      `%${location}%`
    );

  }





  const {
    data:products,
    error
  } = await query;



  if(error){

    console.log(error);

    return [];

  }



  return products || [];

}







export const metadata = {

title:"Browse Listings | Halo Marketplace",

description:
"Find products and deals from local sellers on Halo Marketplace."

};








export default async function BrowsePage({searchParams}){


const search = searchParams?.search || "";

const category = searchParams?.category || "";

const location = searchParams?.location || "";



const products = await getProducts(
search,
category,
location
);





return (

<main className="min-h-screen bg-gray-50">






{/* HERO */}



<section className="
bg-black
text-white
py-16
px-6
">


<div className="
max-w-6xl
mx-auto
flex
flex-col
md:flex-row
justify-between
gap-8
">


<div>


<h1 className="
text-5xl
font-bold
">

Browse Halo Marketplace

</h1>



<p className="
mt-4
text-lg
text-gray-300
">

Discover products from sellers near you.

</p>



</div>




<Link

href="/sell"

className="
h-fit
rounded-xl
bg-white
px-6
py-3
font-semibold
text-black
"

>

Sell Something

</Link>



</div>


</section>







{/* FILTERS */}



<section className="
max-w-6xl
mx-auto
px-6
py-10
">


<form

action="/browse"

className="
grid
gap-4
rounded-2xl
bg-white
p-6
shadow
md:grid-cols-4
"

>


<input

name="search"

defaultValue={search}

placeholder="Search listings..."

className="
rounded-xl
border
px-5
py-3
"

/>





<select

name="category"

defaultValue={category}

className="
rounded-xl
border
px-5
py-3
"

>

<option value="">
All Categories
</option>

<option value="Electronics">
Electronics
</option>

<option value="Vehicles">
Vehicles
</option>

<option value="Home">
Home
</option>

<option value="Gaming">
Gaming
</option>

<option value="Other">
Other
</option>


</select>







<select

name="location"

defaultValue={location}

className="
rounded-xl
border
px-5
py-3
"

>

<option value="">
All Locations
</option>

<option value="Alberta">
Alberta
</option>

<option value="Ontario">
Ontario
</option>

<option value="British Columbia">
British Columbia
</option>


</select>





<button

type="submit"

className="
rounded-xl
bg-black
px-6
py-3
font-semibold
text-white
"

>

Search

</button>



</form>


</section>








{/* RESULTS */}



<section className="
max-w-6xl
mx-auto
px-6
pb-20
">


<div className="
mb-8
flex
justify-between
items-center
">


<h2 className="
text-3xl
font-bold
">

Listings ({products.length})

</h2>



</div>







{
products.length > 0 ? (



<div className="
grid
grid-cols-1
sm:grid-cols-2
lg:grid-cols-4
gap-6
">


{

products.map(product => (



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

sizes="(max-width:768px)100vw,25vw"

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


<h3 className="
truncate
text-lg
font-bold
">

{product.title}

</h3>




<p className="
mt-3
text-xl
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
"

>

{product.category}

</span>


)

}



</div>



</Link>


))


}



</div>




):(



<div className="
rounded-2xl
bg-white
p-12
text-center
">


<h2 className="
text-2xl
font-bold
">

No listings found

</h2>


<p className="
mt-3
text-gray-500
">

Try changing your filters.

</p>



<Link

href="/sell"

className="
mt-6
inline-block
rounded-xl
bg-black
px-6
py-3
font-bold
text-white
"

>

Create Listing

</Link>



</div>



)

}



</section>






</main>

);

}