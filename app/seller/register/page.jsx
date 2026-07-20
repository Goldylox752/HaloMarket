import Link from "next/link";

export default function SellerRegisterPage(){

return (

<main className="min-h-screen bg-gray-50 px-6 py-20">


<div className="mx-auto max-w-xl rounded-3xl bg-white p-10 shadow">


<h1 className="text-4xl font-black">
Create Seller Account
</h1>


<p className="mt-4 text-gray-600">
Start selling your products on Halo Marketplace.
</p>



<form className="mt-8 space-y-5">


<input
type="text"
placeholder="Full Name"
className="w-full rounded-xl border p-4"
/>


<input
type="email"
placeholder="Email Address"
className="w-full rounded-xl border p-4"
/>


<input
type="password"
placeholder="Password"
className="w-full rounded-xl border p-4"
/>


<input
type="text"
placeholder="Store Name"
className="w-full rounded-xl border p-4"
/>



<select className="w-full rounded-xl border p-4">

<option>
Select Category
</option>

<option>
Electronics
</option>

<option>
Fashion
</option>

<option>
Vehicles
</option>

<option>
Home
</option>

</select>




<button

type="submit"

className="w-full rounded-xl bg-indigo-600 py-4 font-bold text-white"

>

Create Seller Account

</button>


</form>



<Link

href="/"

className="mt-6 block text-center text-indigo-600"

>

← Back to Marketplace

</Link>



</div>


</main>

);

}