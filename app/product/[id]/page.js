export default async function ProductPage({params}){


const {id}=await params;



const product={

id,

title:"Apple MacBook Pro M3",

price:"$1,899 CAD",

location:"Edmonton, Alberta",

seller:"Byron Tech Store",

description:
"Premium laptop with M3 chip, perfect for developers, creators, and professionals.",

image:"💻"

};



return (

<main className="min-h-screen bg-gray-50 py-16 px-6">


<div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-12">


{/* Product Image */}

<div className="bg-white rounded-3xl shadow p-20 flex items-center justify-center">

<div className="text-9xl">

{product.image}

</div>

</div>




{/* Product Details */}

<div className="bg-white rounded-3xl shadow p-10">


<h1 className="text-5xl font-bold">

{product.title}

</h1>



<p className="mt-5 text-3xl text-indigo-600 font-bold">

{product.price}

</p>



<p className="mt-4 text-gray-500">

📍 {product.location}

</p>




<div className="mt-8">


<h2 className="text-2xl font-bold">

Description

</h2>


<p className="mt-3 text-gray-600">

{product.description}

</p>


</div>




<div className="mt-10 border-t pt-6">


<h2 className="font-bold text-xl">

Seller

</h2>


<p className="mt-2">

{product.seller}

</p>


<button className="mt-6 w-full bg-indigo-600 text-white py-4 rounded-xl text-lg font-bold">

Message Seller

</button>


<button className="mt-4 w-full bg-black text-white py-4 rounded-xl text-lg font-bold">

Buy Now

</button>


</div>


</div>


</div>


</main>

)

}
