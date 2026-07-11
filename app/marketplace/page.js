import ProductCard from "@/components/ProductCard";
import SearchBar from "@/components/SearchBar";
import CategoryCard from "@/components/CategoryCard";


export default function MarketplacePage(){


const categories = [

{
title:"Electronics",
icon:"📱"
},

{
title:"Vehicles",
icon:"🚗"
},

{
title:"Home",
icon:"🏠"
},

{
title:"Fashion",
icon:"👕"
}

];


const products=[

{
id:1,
title:"MacBook Pro M3",
price:"$1,899",
location:"Edmonton, AB",
image:"💻"
},

{
id:2,
title:"Toyota Tacoma TRD",
price:"$34,500",
location:"Calgary, AB",
image:"🚙"
},

{
id:3,
title:"Gaming PC",
price:"$2,200",
location:"Toronto, ON",
image:"🎮"
},

{
id:4,
title:"Mountain Bike",
price:"$750",
location:"Vancouver, BC",
image:"🚲"
}

];



return (

<main className="min-h-screen bg-gray-50">


<section className="bg-indigo-700 text-white py-16">

<div className="max-w-7xl mx-auto px-6">


<h1 className="text-5xl font-bold">
Explore Halo Marketplace
</h1>


<p className="mt-4 text-xl text-white/80">

Thousands of products from trusted sellers across Canada.

</p>


<div className="mt-8">

<SearchBar />

</div>


</div>

</section>




<section className="max-w-7xl mx-auto px-6 py-12">


<h2 className="text-3xl font-bold">
Categories
</h2>



<div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-6">


{
categories.map(category=>(

<CategoryCard
key={category.title}
{...category}
/>

))
}


</div>


</section>




<section className="max-w-7xl mx-auto px-6 pb-20">


<div className="flex justify-between items-center">


<h2 className="text-3xl font-bold">
Latest Products
</h2>


<select className="border rounded-xl px-4 py-2">

<option>
Newest
</option>

<option>
Lowest Price
</option>

<option>
Highest Price
</option>

</select>


</div>




<div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-4 gap-8">


{
products.map(product=>(

<ProductCard

key={product.id}

{...product}

/>

))

}


</div>


</section>


</main>

)

}
