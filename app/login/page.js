export default function LoginPage(){

return(

<main className="min-h-screen flex items-center justify-center bg-gray-50">

<div className="bg-white p-10 rounded-2xl shadow max-w-md w-full">


<h1 className="text-3xl font-bold">
Login
</h1>


<p className="mt-2 text-gray-600">
Welcome back to Halo Marketplace.
</p>


<input
className="mt-6 w-full border rounded-xl p-3"
placeholder="Email"
/>


<input
className="mt-4 w-full border rounded-xl p-3"
placeholder="Password"
type="password"
/>


<button className="mt-6 w-full bg-indigo-600 text-white rounded-xl py-3">
Login
</button>


</div>

</main>

);

}
