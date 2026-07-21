export default function SellerBadge({verified,rating}){

return (

<div className="flex items-center gap-2">


{verified ? (

<span className="
rounded-full
bg-green-100
px-3
py-1
text-xs
font-bold
text-green-700
">

✓ Verified Seller

</span>

):(

<span className="
rounded-full
bg-gray-100
px-3
py-1
text-xs
font-bold
">

New Seller

</span>

)}



{rating > 0 && (

<span className="
text-sm
text-gray-600
">

⭐ {rating}

</span>

)}


</div>

)

}