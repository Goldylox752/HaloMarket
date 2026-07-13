import Link from "next/link";


const categories = [

{
name:"Vehicles",
icon:"🚗",
description:"Cars, trucks, motorcycles and more",
slug:"Vehicles"
},

{
name:"Electronics",
icon:"📱",
description:"Phones, computers, gadgets",
slug:"Electronics"
},

{
name:"Home",
icon:"🏠",
description:"Furniture, appliances and decor",
slug:"Home"
},

{
name:"Fashion",
icon:"👕",
description:"Clothing, shoes and accessories",
slug:"Fashion"
},

{
name:"Gaming",
icon:"🎮",
description:"Consoles, games and accessories",
slug:"Gaming"
},

{
name:"Tools",
icon:"🛠",
description:"Equipment and hardware",
slug:"Tools"
},

{
name:"Sports",
icon:"⚽",
description:"Fitness and outdoor gear",
slug:"Sports"
},

{
name:"Services",
icon:"💼",
description:"Local services and businesses",
slug:"Services"
}

];



export default function CategoriesPage(){


return (

<main className="min-h-screen bg-gray-50 py-16 px-6">


<div className="max-w-7xl mx-auto">



<div className="text-center">


<h1 className="text-5xl font-bold">

Browse Categories

</h1>


<p className="text-gray-500 mt-4 text-lg">

Find thousands of products from sellers across Canada.

</p>


</div>





<div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 mt-12">


{categories.map((category)=>(


<Link

key={category.slug}

href={`/products?category=${category.slug}`}

className="bg-white rounded-3xl shadow p-8 hover:shadow-xl transition"

>



<div className="text-6xl">

{category.icon}

</div>



<h2 className="text-2xl font-bold mt-5">

{category.name}

</h2>



<p className="text-gray-500 mt-3">

{category.description}

</p>



<div className="mt-6 text-indigo-600 font-semibold">

Browse →
 
</div>



</Link>



))}


</div>



</div>



</main>

)

}
