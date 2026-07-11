export default function SellerProfile({

name,
location,
rating

}){


return (

<div className="bg-white rounded-2xl shadow p-6">


<div className="flex items-center gap-4">


<div className="
w-16
h-16
rounded-full
bg-indigo-600
text-white
flex
items-center
justify-center
text-2xl
">

👤

</div>


<div>

<h3 className="font-bold text-xl">

{name}

</h3>


<p className="text-gray-500">

📍 {location}

</p>


<p>

⭐ {rating}

</p>


</div>


</div>


</div>

)

}
