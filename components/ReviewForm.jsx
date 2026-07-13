"use client";


import { useState } from "react";
import { createClient } from "@/lib/supabase/client";



export default function ReviewForm({

productId,

sellerId

}){


const [rating,setRating]=useState(5);

const [comment,setComment]=useState("");

const [message,setMessage]=useState("");





async function submitReview(){



const supabase=createClient();




const {

data:{
user

}

}=await supabase.auth.getUser();





if(!user){

setMessage(
"Please login first"
);

return;

}





const {

error

}=await supabase

.from("reviews")

.insert({

buyer_id:user.id,

seller_id:sellerId,

product_id:productId,

rating,

comment

});






if(error){

setMessage(
"Unable to submit review"
);

return;

}




setMessage(
"Review submitted!"
);


setComment("");



}







return (

<div className="bg-white rounded-3xl shadow p-8">



<h2 className="text-2xl font-bold">

Leave Review

</h2>





<div className="flex gap-3 mt-5">


{

[1,2,3,4,5].map((star)=>(


<button

key={star}

onClick={()=>setRating(star)}

className="text-3xl"

>

{

star <= rating

?

"⭐"

:

"☆"

}


</button>



))

}



</div>







<textarea

value={comment}

onChange={(e)=>setComment(e.target.value)}

placeholder="Share your experience..."

className="w-full border rounded-xl p-4 mt-5 h-32"

/>






<button

onClick={submitReview}

className="mt-5 w-full bg-indigo-600 text-white py-4 rounded-xl font-bold"

>

Submit Review

</button>





{

message && (

<p className="mt-4 text-center text-gray-600">

{message}

</p>

)

}



</div>

)

}
