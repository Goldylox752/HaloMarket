"use client";

import { useState } from "react";
import Link from "next/link";
import MobileMenu from "./MobileMenu";


export default function Navbar() {


const [open,setOpen] = useState(false);



const links = [

{
name:"Home",
href:"/"
},

{
name:"Marketplace",
href:"/marketplace"
},

{
name:"Products",
href:"/products"
},

{
name:"Categories",
href:"/categories"
},

{
name:"Sell",
href:"/sell"
},

{
name:"Seller Center",
href:"/seller"
},

{
name:"Support",
href:"/support"
},

];



return (


<header className="sticky top-0 z-50 border-b bg-white/95 backdrop-blur">


<div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">



{/* LOGO */}

<Link
href="/"
className="text-3xl font-black"
>
Halo Market
</Link>





{/* DESKTOP LINKS */}

<nav className="hidden items-center gap-6 lg:flex">


{links.map((link)=>(


<Link

key={link.href}

href={link.href}

className="text-sm font-semibold hover:text-indigo-600"

>

{link.name}

</Link>


))}


</nav>





{/* ACCOUNT LINKS */}

<div className="hidden items-center gap-3 lg:flex">



<Link

href="/favourites"

className="font-semibold hover:text-indigo-600"

>
❤️
</Link>




<Link

href="/messages"

className="font-semibold hover:text-indigo-600"

>
💬
</Link>




<Link

href="/orders"

className="font-semibold hover:text-indigo-600"

>
📦
</Link>




<Link

href="/dashboard"

className="font-semibold hover:text-indigo-600"

>
📊
</Link>





<Link

href="/login"

className="rounded-xl border px-5 py-2 font-semibold hover:bg-gray-100"

>

Login

</Link>





<Link

href="/signup"

className="rounded-xl bg-indigo-600 px-5 py-2 font-bold text-white hover:bg-indigo-700"

>

Sign Up

</Link>



</div>






{/* MOBILE BUTTON */}


<button

onClick={()=>setOpen(!open)}

className="rounded-lg border px-3 py-2 lg:hidden"

>

{open ? "✕" : "☰"}

</button>



</div>




{/* MOBILE LINKS */}

<MobileMenu

open={open}

setOpen={setOpen}

/>



</header>


);


}