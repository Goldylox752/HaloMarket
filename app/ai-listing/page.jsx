import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";


export const metadata = {

title:"AI Listing Assistant | Halo Marketplace",

description:
"Create marketplace listings instantly with Halo AI."

};



export default async function AIListingPage(){


const supabase = await createClient();


const {
data:{
user
}

}=await supabase.auth.getUser();



if(!user){

redirect("/login");

}




return (

<main className="
min-h-screen
bg-gray-50
px-6
py-16
">


<div className="
mx-auto
max-w-5xl
">



<section className="
rounded-3xl
bg-black
p-12
text-white
">


<span className="
rounded-full
bg-white/10
px-4
py-2
text-sm
font-bold
">

🤖 Halo AI

</span>



<h1 className="
mt-6
text-5xl
font-black
">

Create Listings
10x Faster

</h1>



<p className="
mt-5
max-w-2xl
text-xl
text-gray-300
">

Upload your product details and Halo AI will create a professional marketplace listing with a title, description, category and pricing suggestion.

</p>


</section>







<section className="
mt-10
rounded-3xl
bg-white
p-10
shadow
">


<form
action="/api/ai-listing"
method="POST"
className="
space-y-6
"
>



<div>


<label className="
mb-2
block
font-bold
">

Product Name

</label>


<input

name="product"

placeholder="Example: MacBook Air M1"

className="
w-full
rounded-xl
border
px-5
py-4
"

/>


</div>







<div>


<label className="
mb-2
block
font-bold
">

Condition

</label>


<select

name="condition"

className="
w-full
rounded-xl
border
px-5
py-4
"

>

<option>
New
</option>

<option>
Like New
</option>

<option>
Good
</option>

<option>
Used
</option>

<option>
Needs Repair
</option>


</select>


</div>








<div>


<label className="
mb-2
block
font-bold
">

Extra Details

</label>


<textarea

name="details"

rows="5"

placeholder="
Brand, model, features, accessories, location...
"

className="
w-full
rounded-xl
border
px-5
py-4
"

/>


</div>







<div>


<label className="
mb-2
block
font-bold
">

Image URL

</label>


<input

name="image"

placeholder="https://..."

className="
w-full
rounded-xl
border
px-5
py-4
"

/>


</div>







<button

className="
w-full
rounded-xl
bg-black
py-4
font-black
text-white
hover:bg-gray-800
"

>

✨ Generate AI Listing

</button>



</form>


</section>







<section className="
mt-10
grid
gap-6
md:grid-cols-4
">


{[

["📝","Smart Titles"],
["💰","Price Suggestions"],
["🔍","SEO Keywords"],
["⚡","Fast Selling"]

].map(item=>(


<div

key={item[1]}

className="
rounded-3xl
bg-white
p-6
text-center
shadow-sm
"

>


<div className="
text-4xl
">

{item[0]}

</div>


<h3 className="
mt-3
font-black
">

{item[1]}

</h3>


</div>


))}



</section>






<div className="
mt-10
text-center
">


<Link

href="/sell"

className="
font-bold
text-indigo-600
"

>

← Create normal listing

</Link>


</div>





</div>


</main>

);


}