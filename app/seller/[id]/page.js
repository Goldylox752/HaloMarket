import SellerProfile from "@/components/SellerProfile";


export default async function SellerPage({params}){


const {id}=await params;


return (

<main className="bg-gray-50 min-h-screen py-16 px-6">


<div className="max-w-5xl mx-auto">


<h1 className="text-5xl font-bold">
Seller Profile
</h1>


<div className="mt-10">


<SellerProfile

name="Byron Tech Store"

location="Alberta, Canada"

rating="4.9"

/>


</div>


<div className="mt-12 bg-white rounded-2xl p-8">


<h2 className="text-3xl font-bold">

Seller Products

</h2>


<p className="mt-4 text-gray-600">

Products will load from Supabase.

</p>


</div>


</div>


</main>

)

}
