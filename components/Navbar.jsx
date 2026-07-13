"use client";


import Link from "next/link";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";



export default function Navbar(){


const [user,setUser]=useState(null);

const [open,setOpen]=useState(false);



const supabase=createClient();





useEffect(()=>{


async function getUser(){


const {

data:{
user

}

}=await supabase.auth.getUser();



setUser(user);


}



getUser();



const {

data:{
subscription

}

}=supabase.auth.onAuthStateChange(

(event,session)=>{


setUser(
session?.user || null
);


}

);



return ()=>{

subscription.unsubscribe();

};


},[]);






async function logout(){


await supabase.auth.signOut();


window.location.href="/login";


}







return (

<nav className="bg-white border-b sticky top-0 z-50">



<div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">





{/* LOGO */}


<Link

href="/"

className="text-3xl font-black text-indigo-600"

>

Halo

</Link>







{/* DESKTOP MENU */}



<div className="hidden md:flex items-center gap-6 font-semibold">



<Link href="/products">

Marketplace

</Link>



<Link href="/categories">

Categories

</Link>



<Link href="/sell">

Sell

</Link>



{
user && (

<>

<Link href="/messages">

💬 Messages

</Link>



<Link href="/favorites">

❤️ Favorites

</Link>



<Link href="/dashboard">

Dashboard

</Link>



</>

)

}



</div>









{/* ACCOUNT */}



<div className="flex items-center gap-4">


{
user ? (



<button

onClick={logout}

className="bg-black text-white px-5 py-2 rounded-xl font-bold"

>

Logout

</button>



):(



<Link

href="/login"

className="bg-indigo-600 text-white px-5 py-2 rounded-xl font-bold"

>

Login

</Link>



)

}




<button

onClick={()=>setOpen(!open)}

className="md:hidden text-2xl"

>

☰

</button>



</div>





</div>









{/* MOBILE MENU */}



{

open && (

<div className="md:hidden px-6 pb-6 space-y-4 font-semibold">


<Link

href="/products"

className="block"

>

Marketplace

</Link>



<Link

href="/categories"

className="block"

>

Categories

</Link>



<Link

href="/sell"

className="block"

>

Sell

</Link>




{
user && (

<>

<Link

href="/messages"

className="block"

>

Messages

</Link>



<Link

href="/favorites"

className="block"

>

Favorites

</Link>



<Link

href="/dashboard"

className="block"

>

Dashboard

</Link>



</>

)

}



</div>

)

}



</nav>

)

}
