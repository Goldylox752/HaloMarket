import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";



async function getOrders(){


const supabase = await createClient();



const {

data:{
user

}

}=await supabase.auth.getUser();




if(!user){

redirect("/login");

}





const {data:orders,error}=await supabase

.from("orders")

.select(`

*,

products(

id,

title,

image,

price,

location

)

`)

.or(

`buyer_id.eq.${user.id},seller_id.eq.${user.id}`

)

.order(

"created_at",

{

ascending:false

}

);






if(error){

console.log(error);

return [];

}



return orders || [];

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






export default async function OrdersPage(){


const orders = await getOrders();





return (

<main className="min-h-screen bg-gray-50 py-12 px-6">



<div className="max-w-7xl mx-auto">



<h1 className="text-5xl font-black">

Orders

</h1>



<p className="text-gray-500 mt-3">

Manage purchases and sales on Halo.

</p>







{

orders.length === 0 ? (



<div className="bg-white rounded-3xl shadow p-10 mt-10 text-center">


<h2 className="text-2xl font-bold">

No orders yet

</h2>



<Link

href="/products"

className="inline-block mt-5 bg-indigo-600 text-white px-6 py-3 rounded-xl"

>

Browse Marketplace

</Link>


</div>



):(





<div className="grid lg:grid-cols-2 gap-8 mt-10">





{

orders.map((order)=>(



<div

key={order.id}

className="bg-white rounded-3xl shadow p-6"

>




<div className="flex gap-5">





<div className="w-32 h-32 bg-gray-100 rounded-2xl overflow-hidden">


{

order.products?.image ? (



<Image

src={order.products.image}

alt={order.products.title}

width={200}

height={200}

className="w-full h-full object-cover"

/>



):(



<div className="flex items-center justify-center h-full text-5xl">

📦

</div>


)

}



</div>








<div>


<h2 className="text-xl font-bold">

{order.products?.title}

</h2>



<p className="text-indigo-600 text-xl font-bold mt-2">

{formatPrice(order.amount)}

</p>




<p className="text-gray-500 mt-2">

📍 {order.products?.location}

</p>




</div>



</div>








<div className="border-t mt-6 pt-5 flex justify-between items-center">


<div>


<p className="font-semibold">

Status

</p>


<p className="text-gray-500 capitalize">

{order.status}

</p>


</div>





<Link

href={`/products/${order.products?.id}`}

className="text-indigo-600 font-bold"

>

View Product →

</Link>



</div>





</div>



))


}





</div>



)

}



</div>


</main>


)

}
