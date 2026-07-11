export default function ProductCard({product}){

return(

<div className="border rounded-2xl overflow-hidden hover:shadow-xl">

<div className="h-48 bg-gray-200 flex items-center justify-center">

Product Image

</div>


<div className="p-5">

<h3 className="font-bold text-xl">
{product.name}
</h3>


<p className="text-gray-600">
{product.location}
</p>


<p className="text-2xl font-black mt-3">
${product.price}
</p>


</div>


</div>

)

}
