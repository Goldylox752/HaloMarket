export default function SellerBadge({
verified,
identity_verified,
trust_score
}){


if(identity_verified){

return (

<span className="
rounded-full
bg-blue-100
px-3
py-1
text-sm
font-bold
text-blue-700
">

🔵 Verified Seller

</span>

);

}



if(verified){

return (

<span className="
rounded-full
bg-green-100
px-3
py-1
text-sm
font-bold
text-green-700
">

🟢 Trusted Seller

</span>

);

}



return (

<span className="
rounded-full
bg-gray-100
px-3
py-1
text-sm
font-bold
">

⚪ New Seller

</span>

);


}