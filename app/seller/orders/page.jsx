import Image from "next/image";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

import { createClient } from "@/lib/supabase/server";



async function updateOrder(formData){

"use server";


const supabase =
await createClient();



const {
data:{
user
}

}=await supabase.auth.getUser();



if(!user){

redirect("/login");

}



const orderId =
formData.get("orderId");

const tracking =
formData.get("tracking");





await supabase

.from("orders")

.update({

tracking_number:
tracking,

status:
"shipped"

})

.eq(
"id",
orderId
)

.eq(
"seller_id",
user.id
);




revalidatePath(
"/seller/orders"
);


}







async function getOrders(){


const supabase =
await createClient();



const {
data:{
user
}

}=await supabase.auth.getUser();



if(!user){

redirect("/login");

}







const {

data:orders,

error

}=await supabase

.from("orders")

.select(`

id,

amount,

status,

payment_status,

tracking_number,

created_at,


product:products(

title,

image,

slug

),


buyer:profiles!orders_buyer_id_fkey(

username,

location

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






if(error){

console.log(error);

return [];

}



return orders || [];

}







function price(value){

return new Intl.NumberFormat(
"en-CA",
{
style:"currency",
currency:"CAD"
}
).format(value || 0);

}








export default async function SellerOrdersPage(){



const orders =
await getOrders();




return (

<main className="
min-h-screen
bg-gray-50
px-6
py-12
">


<div className="
mx-auto
max-w-6xl
">



<h1 className="
text-5xl
font-black
">

📦 Seller Orders

</h1>


<p className="
mt-3
text-gray-600
">

Manage your Halo Marketplace sales.

</p>







<section className="
mt-10
space-y-6
">



{

orders.length === 0 ? (


<div className="
rounded-3xl
bg-white
p-10
text-center
">

<h2 className="
text-2xl
font-bold
">

No orders yet

</h2>

</div>


)

:

orders.map(order=>(


<div

key={order.id}

className="
rounded-3xl
bg-white
p-8
shadow-sm
"

>



<div className="
flex
flex-col
md:flex-row
gap-6
">





<div className="
relative
h-32
w-32
rounded-xl
overflow-hidden
bg-gray-100
">


{

order.product?.image &&

<Image

src={order.product.image}

alt={order.product.title}

fill

className="
object-cover
"

/>

}


</div>







<div className="
flex-1
">


<h2 className="
text-2xl
font-black
">

{order.product?.title}

</h2>



<p className="
mt-2
text-xl
font-bold
">

{price(order.amount)}

</p>



<p className="
mt-3
text-gray-500
">

Buyer: {order.buyer?.username}

</p>


<p className="
text-gray-500
">

📍 {order.buyer?.location}

</p>






<div className="
mt-4
inline-block
rounded-full
bg-gray-100
px-4
py-2
font-bold
">

{order.status}

</div>



</div>




</div>







<form

action={updateOrder}

className="
mt-8
flex
flex-col
md:flex-row
gap-4
"

>


<input

type="hidden"

name="orderId"

value={order.id}

/>



<input

name="tracking"

defaultValue={
order.tracking_number || ""
}

placeholder="Enter tracking number"

className="
flex-1
rounded-xl
border
px-5
py-3
"

/>



<button

className="
rounded-xl
bg-black
px-6
py-3
font-bold
text-white
"

>

Ship Order

</button>



</form>





</div>


))

}



</section>





</div>


</main>

);


}