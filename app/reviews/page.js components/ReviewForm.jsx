import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import ReviewForm from "@/components/ReviewForm";



async function getReviews(){


const supabase = await createClient();



const {

data:{
user

}

}=await supabase.auth.getUser();



if(!user){

redirect("/login");

}





const {data:reviews}=await supabase

.from("reviews")

.select(`

*,

profiles:seller_id(

username,

avatar

),

products(

title

)

`)

.eq(
"buyer_id",
user.id
)

.order(

"created_at",

{

ascending:false

}

);



return reviews || [];

}







export default async function ReviewsPage(){


const reviews = await getReviews();





return (

<main className="min-h-screen bg-gray-50 py-12 px-6">



<div className="max-w-5xl mx-auto">



<h1 className="text-5xl font-black">

Reviews

</h1>



<p className="text-gray-500 mt-3">

Rate your Halo marketplace experiences.

</p>








<div className="mt-10 space-y-6">



{

reviews.length === 0 ? (


<div className="bg-white rounded-3xl shadow p-10">


<h2 className="text-2xl font-bold">

No reviews available

</h2>


<p className="text-gray-500 mt-2">

Complete purchases to leave reviews.

</p>


</div>



):(



reviews.map((review)=>(


<div

key={review.id}

className="bg-white rounded-3xl shadow p-8"

>


<h2 className="text-xl font-bold">

{review.products?.title}

</h2>




<p className="mt-3 text-yellow-500 text-2xl">

{"⭐".repeat(review.rating)}

</p>




<p className="mt-4 text-gray-600">

{review.comment}

</p>



<p className="mt-5 text-sm text-gray-500">

Seller:

{review.profiles?.username}

</p>



</div>



))


)



}



</div>





</div>



</main>

)

}
