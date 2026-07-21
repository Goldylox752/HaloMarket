import Image from "next/image";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";



async function getProducts(
  search,
  category,
  location,
  minPrice,
  maxPrice,
  sort
){


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


}else if(sort === "high"){


query = query.order(
"price",
{
ascending:false
}
);



}else{


query = query.order(
"created_at",
{
ascending:false
}
);


}







const {
data:products,
error
}= await query;




if(error){

console.log(error);

return [];

}



return products || [];

}






export const metadata = {

title:"Browse Listings | Halo Marketplace",

description:
"Find products and deals from local sellers."

};






export default async function BrowsePage({
searchParams
}){


const search = searchParams?.search || "";

const category = searchParams?.category || "";

const location = searchParams?.location || "";

const minPrice = searchParams?.minPrice || "";

const maxPrice = searchParams?.maxPrice || "";

const sort = searchParams?.sort || "new";




const products = await getProducts(
search,
category,
location,
minPrice,
maxPrice,
sort
);





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
flex
justify-between
items-center
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
text-gray-300
">

Find deals from sellers near you.

</p>


</div>



<Link

href="/sell"

className="
rounded-xl
bg-white
px-6
py-3
font-bold
text-black
"

>

Sell Something

</Link>



</div>


</section>






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
md:grid-cols-6
"

>


<input

name="search"

defaultValue={search}

placeholder="Search..."

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

<option>
Electronics
</option>

<option>
Vehicles
</option>

<option>
Home
</option>

<option>
Gaming
</option>

<option>
Other
</option>


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


</select>






<input

name="minPrice"

defaultValue={minPrice}

placeholder="Min $"

type="number"

className="
rounded-xl
border
px-4
py-3
"

/>




<input

name="maxPrice"

defaultValue={maxPrice}

placeholder="Max $"

type="number"

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
text-white
font-bold
px-5
"

>

Filter

</button>



</form>


</section>







<section className="
max-w-6xl
mx-auto
px-6
pb-20
">


<h2 className="
mb-8
text-3xl
font-bold
">

Listings ({products.length})

</h2>





<div className="
grid
grid-cols-1
sm:grid-cols-2
lg:grid-cols-4
gap-6
">


{

products.map(product=>(


<Link

key={product.id}

href={`/product/${product.slug}`}

className="
overflow-hidden
rounded-2xl
bg-white
shadow-sm
hover:shadow-xl
transition
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

className="object-cover"

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
font-bold
text-lg
truncate
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

📍 {product.location}

</p>



</div>



</Link>


))

}



</div>



</section>



</main>

);

}