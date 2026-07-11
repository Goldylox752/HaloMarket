export default function ReviewCard({

name,
review

}){


return (

<div className="
bg-white
rounded-xl
shadow
p-5
">


<h3 className="font-bold">

{name}

</h3>


<p className="mt-3 text-gray-600">

"{review}"

</p>


<div className="mt-3">
⭐⭐⭐⭐⭐
</div>


</div>

)

}
