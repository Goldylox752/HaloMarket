"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";


export default function BuyButton({
  productId
}){


const [loading,setLoading] =
useState(false);


const router = useRouter();




async function handleBuy(){


try{


setLoading(true);



const response =
await fetch(
"/api/payments/checkout",
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





const data =
await response.json();





if(!response.ok){

alert(
data.error ||
"Checkout failed"
);

return;

}





if(data.url){

window.location.href =
data.url;

}





}catch(error){


console.error(error);


alert(
"Something went wrong"
);


}finally{


setLoading(false);


}


}





return (

<button

onClick={handleBuy}

disabled={loading}

className="
w-full
rounded-xl
bg-black
px-6
py-4
font-bold
text-white
transition
hover:bg-gray-800
disabled:opacity-50
"

>

{

loading

?

"Creating Checkout..."

:

"🛡️ Buy Now - Halo Protection"

}


</button>


);

}