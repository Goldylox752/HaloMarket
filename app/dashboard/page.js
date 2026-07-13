import Link from "next/link";
import Image from "next/image";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";



async function getDashboardData(){


const supabase = await createClient();



const {
data:{
user
}

}=await supabase.auth.getUser();



if(!user){

redirect("/login");

}




const {data:profile}=await supabase

.from("profiles")

.select("*")

.eq("id",user.id)

.single();





const {data:listings}=await supabase

.from("products")

.select("*")

.eq("seller_id",user.id)

.order(
"created_at",
{
ascending:false
}
);





const {data:sales}=await supabase

.from("orders")

.select(`

*,

products(

title,

image

)

`)

.eq(
"seller_id",
user.id
)

.order(
"created_at",
{
ascending:false
}
);





return {

profile,

listings:listings || [],

sales:sales || []

};


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







export default async function DashboardPage(){


const {

profile,

listings,

sales

}=await getDashboardData();




const revenue = sales.reduce(

(total,item)=>

total + Number(item.amount || 0),

0

);







return(

<main className="min-h-screen bg-gray-50 p-10">



<div className="max-w-7xl mx-auto">





<div className="flex justify-between items-center">



<div>


<h1 className="text-5xl font-black">

Seller Dashboard

</h1>


<p className="text-gray-500 mt-3">

Welcome back {profile?.username || "Seller"}

</p>


</div>




<Link

href="/sell"

className="bg-indigo-600 text-white px-6 py-4 rounded-xl font-bold"

>

+ Create Listing

</Link>



</div>









{/* STATS */}



<div className="grid md:grid-cols-3 gap-6 mt-10">



<div className="bg-white p-8 rounded-2xl shadow">


<h2 className="text-4xl font-black">

{listings.length}

</h2>


<p className="text-gray-500">

Listings

</p>


</div>







<div className="bg-white p-8 rounded-2xl shadow">


<h2 className="text-4xl font-black">

{sales.length}

</h2>


<p className="text-gray-500">

Sales

</p>


</div>







<div className="bg-white p-8 rounded-2xl shadow">


<h2 className="text-4xl font-black">

{formatPrice(revenue)}

</h2>


<p className="text-gray-500">

Revenue

</p>


</div>



</div>









{/* LISTINGS */}



<section className="mt-12">


<h2 className="text-3xl font-black mb-6">

My Listings

</h2>



<div className="grid md:grid-cols-4 gap-6">



{

listings.map((product)=>(


<Link

key={product.id}

href={`/products/${product.id}`}

className="bg-white rounded-2xl shadow overflow-hidden"

>


<div className="h-48 bg-gray-100">


{

product.image ? (


<Image

src={product.image}

alt={product.title}

width={400}

height={300}

className="w-full h-full object-cover"

/>



):(


<div className="flex items-center justify-center h-full text-5xl">

📦

</div>


)

}



</div>





<div className="p-5">


<h3 className="font-bold">

{product.title}

</h3>


<p className="text-indigo-600 font-bold mt-2">

{formatPrice(product.price)}

</p>


<p className="text-sm text-gray-500">

{product.status || "active"}

</p>


</div>




</Link>



))


}



</div>


</section>









{/* SALES */}



<section className="mt-12">


<h2 className="text-3xl font-black mb-6">

Recent Sales

</h2>



<div className="bg-white rounded-3xl shadow">



{

sales.length === 0 ? (


<p className="p-8 text-gray-500">

No sales yet.

</p>



):(



sales.map((sale)=>(


<div

key={sale.id}

className="p-6 border-b flex justify-between"

>


<div>


<h3 className="font-bold">

{sale.products?.title}

</h3>


<p className="text-gray-500">

Status: {sale.status}

</p>


</div>




<p className="font-bold text-indigo-600">

{formatPrice(sale.amount)}

</p>



</div>



))


)


}



</div>


</section>





</div>


</main>

)


}
