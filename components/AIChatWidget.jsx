"use client";

import { useState } from "react";


export default function AIChatWidget(){

const [open,setOpen]=useState(false);


return (

<>

<button

onClick={()=>setOpen(!open)}

className="
fixed
bottom-6
right-6
bg-indigo-600
text-white
rounded-full
w-16
h-16
text-2xl
shadow-xl
"

>

🤖

</button>



{
open && (

<div className="
fixed
bottom-24
right-6
w-80
bg-white
rounded-2xl
shadow-xl
border
p-6
">


<h3 className="font-bold text-xl">
Halo AI Assistant
</h3>


<p className="mt-3 text-gray-600">

Need help finding something?

</p>


<input

className="
mt-4
w-full
border
rounded-xl
p-3
"

placeholder="Ask Halo AI..."

/>


<button className="
mt-4
bg-indigo-600
text-white
w-full
py-3
rounded-xl
">

Send

</button>


</div>

)

}

</>

)

}
