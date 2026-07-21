import Image from "next/image";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";



async function getProducts(
  search,
  category,
  location,
  minPrice,
  maxPrice,
  sort,
  page
){

  const supabase = await createClient();


  const limit = 12;


  const start =
  (Number(page)-1) * limit;


  const end =
  start + limit - 1;




  let query = supabase

  .from("products")

  .select(`
    id,
    title,
    price,
    image,
    location,
    slug,
    category,
    seller_id,
    featured,
    created_at
  `);






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





  if(minPrice){

    query = query.gte(
      "price",
      Number(minPrice)
    );

  }





  if(maxPrice){

    query = query.lte(
      "price",
      Number(maxPrice)
    );

  }






  if(sort === "low"){

    query = query.order(
      "price",
      {
        ascending:true
      }
    );


  } else if(sort === "high"){


    query = query.order(
      "price",
      {
        ascending:false
      }
    );


  } else {


    query = query.order(
      "created_at",
      {
        ascending:false
      }
    );


  }







  const {
    data,
    error
  } = await query.range(
    start,
    end
  );





  if(error){

    console.error(error);

    return [];

  }




  return data || [];

}







async function getSeller(id){

  if(!id){

    return null;

  }



  const supabase =
  await createClient();




  const {
    data,
    error
  } = await supabase

  .from("profiles")

  .select(`
    username,
    avatar,
    verified
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







export const metadata = {


title:
"Browse Listings | Halo Marketplace",


description:
"Search and discover products from verified Canadian sellers."

};







export default async function BrowsePage({
  searchParams
}){


const params =
await searchParams;



const search =
params?.search || "";


const category =
params?.category || "";


const location =
params?.location || "";


const minPrice =
params?.minPrice || "";


const maxPrice =
params?.maxPrice || "";


const sort =
params?.sort || "new";


const page =
params?.page || 1;






const products =
await getProducts(
search,
category,
location,
minPrice,
maxPrice,
sort,
page
);






const productsWithSellers =
await Promise.all(

products.map(async(product)=>({

...product,

seller:
await getSeller(
product.seller_id
)

}))

);
const createUrl = (newPage)=>{

return `/browse?search=${search}&category=${category}&location=${location}&minPrice=${minPrice}&maxPrice=${maxPrice}&sort=${sort}&page=${newPage}`;

};




const categories = [

"Electronics",
"Vehicles",
"Home",
"Gaming",
"Tools",
"Sports",
"Other"

];







return (

<main className="
min-h-screen
bg-gray-50
">







{/* HERO */}


<section className="
bg-black
px-6
py-16
text-white
">


<div className="
mx-auto
flex
max-w-7xl
flex-col
justify-between
gap-8
md:flex-row
md:items-center
">


<div>


<h1 className="
text-5xl
font-black
">

Browse Halo Marketplace

</h1>



<p className="
mt-4
max-w-xl
text-lg
text-gray-300
">

Discover products from Canadian sellers with verified accounts.

</p>


</div>






<Link

href="/sell"

className="
rounded-xl
bg-white
px-8
py-4
text-center
font-bold
text-black
"

>

+ Sell Item

</Link>



</div>


</section>









{/* FILTERS */}


<section className="
mx-auto
max-w-7xl
px-6
py-10
">


<form

action="/browse"

className="
grid
gap-4
rounded-3xl
bg-white
p-6
shadow
md:grid-cols-6
"

>




<input

name="search"

defaultValue={search}

placeholder="Search products..."

className="
rounded-xl
border
px-4
py-3
"

/>








<select

name="category"

defaultValue={category}

className="
rounded-xl
border
px-4
py-3
"

>


<option value="">
Category
</option>



{categories.map(item=>(


<option

key={item}

value={item}

>

{item}

</option>


))}


</select>








<select

name="location"

defaultValue={location}

className="
rounded-xl
border
px-4
py-3
"

>


<option value="">
Location
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


<option>
Quebec
</option>


</select>







<input

name="minPrice"

type="number"

defaultValue={minPrice}

placeholder="Min price"

className="
rounded-xl
border
px-4
py-3
"

/>







<input

name="maxPrice"

type="number"

defaultValue={maxPrice}

placeholder="Max price"

className="
rounded-xl
border
px-4
py-3
"

/>








<select

name="sort"

defaultValue={sort}

className="
rounded-xl
border
px-4
py-3
"

>


<option value="new">
Newest
</option>


<option value="low">
Lowest Price
</option>


<option value="high">
Highest Price
</option>


</select>






<button

className="
rounded-xl
bg-black
font-bold
text-white
"

>

Search

</button>



</form>


</section>








{/* RESULTS HEADER */}



<section className="
mx-auto
max-w-7xl
px-6
">


<div className="
mb-8
flex
items-center
justify-between
">


<h2 className="
text-3xl
font-black
">

Latest Listings

</h2>



<p className="
text-gray-500
">

{products.length} results

</p>



</div>
{/* ================= PRODUCT GRID ================= */}


{
productsWithSellers.length === 0 ? (


<div className="
rounded-3xl
bg-white
p-12
text-center
">


<h3 className="
text-2xl
font-black
">

No listings found

</h3>


<p className="
mt-3
text-gray-500
">

Try changing your filters.

</p>


</div>



) : (



<div className="
grid
gap-6
sm:grid-cols-2
lg:grid-cols-4
">


{productsWithSellers.map(product=>(


<Link

key={product.id}

href={`/product/${product.slug}`}

className="
group
overflow-hidden
rounded-3xl
border
bg-white
transition
hover:-translate-y-1
hover:shadow-xl
"

>



{/* IMAGE */}


<div className="
relative
h-60
bg-gray-100
">


{product.image ? (

<Image

src={product.image}

alt={product.title}

fill

className="
object-cover
transition
group-hover:scale-105
"

/>

) : (


<div className="
flex
h-full
items-center
justify-center
text-5xl
">

📦

</div>


)}






{product.featured && (

<span className="
absolute
left-4
top-4
rounded-full
bg-black
px-3
py-1
text-xs
font-bold
text-white
">

⭐ Featured

</span>


)}



</div>







{/* DETAILS */}


<div className="
p-5
">


<span className="
rounded-full
bg-gray-100
px-3
py-1
text-xs
font-bold
">

{product.category || "General"}

</span>







<h3 className="
mt-4
truncate
text-lg
font-black
">

{product.title}

</h3>







<p className="
mt-3
text-2xl
font-black
">

{formatPrice(product.price)}

</p>







<p className="
mt-2
text-sm
text-gray-500
">

📍 {product.location || "Canada"}

</p>







{/* SELLER TRUST */}


<div className="
mt-5
flex
items-center
gap-3
border-t
pt-4
">





{product.seller?.avatar ? (

<Image

src={product.seller.avatar}

alt="Seller"

width={36}

height={36}

className="
rounded-full
"

/>

) : (


<div className="
flex
h-9
w-9
items-center
justify-center
rounded-full
bg-gray-200
">

👤

</div>


)}







<div>


<p className="
text-sm
font-bold
">

{product.seller?.username || "Halo Seller"}

</p>





{product.seller?.verified && (

<p className="
text-xs
font-bold
text-green-600
">

✓ Verified Seller

</p>


)}


</div>


</div>




</div>


</Link>


))}



</div>


)

}







{/* PAGINATION */}



<div className="
mt-12
flex
justify-center
gap-4
">


{Number(page) > 1 && (

<Link

href={createUrl(Number(page)-1)}

className="
rounded-xl
bg-black
px-6
py-3
font-bold
text-white
"

>

← Previous

</Link>

)}






{products.length === 12 && (

<Link

href={createUrl(Number(page)+1)}

className="
rounded-xl
bg-black
px-6
py-3
font-bold
text-white
"

>

Next →

</Link>

)}



</div>






</section>






</main>

);

}