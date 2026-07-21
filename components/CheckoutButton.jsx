"use client";

import { useState } from "react";



export default function CheckoutButton({
productId
}){


const [loading,setLoading] = useState(false);

const [error,setError] = useState("");





async function checkout(){


setLoading(true);

setError("");



try{


const response = await fetch(
"/api/checkout",
{
method:"POST",

headers:{
"Content-Type":"application/json"
},

body:JSON.stringify({
productId
})

}

);




const data = await response.json();





if(!response.ok){

throw new Error(
data.error || "Checkout failed"
);

}





if(data.url){

window.location.href = data.url;

return;

}




throw new Error(
"No checkout URL returned"
);



}catch(err){


console.error(err);


setError(
err.message
);



}finally{


setLoading(false);


}



}






return (

<div>


<button

onClick={checkout}

disabled={loading}

className="
w-full
rounded-xl
bg-indigo-600
py-4
font-bold
text-white
transition
hover:bg-indigo-700
disabled:opacity-50
"

>


{

loading

?

"Processing..."

:

"Buy Now"

}


</button>





{
error && (

<p className="
mt-3
text-center
text-sm
text-red-600
">

{error}

</p>

)

}



</div>

);


}