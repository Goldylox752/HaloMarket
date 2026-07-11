import ProductCard from "./ProductCard";


const products=[
{
name:"iPhone 15 Pro",
price:"999",
location:"Toronto, ON"
},
{
name:"MacBook Pro",
price:"1800",
location:"Vancouver, BC"
},
{
name:"DJI Drone",
price:"899",
location:"Calgary, AB"
}
];


export default function FeaturedSection(){

return(

<section className="py-20">

<div className="max-w-7xl mx-auto px-6">


<h2 className="text-4xl font-bold mb-10">
Featured Products
</h2>


<div className="grid md:grid-cols-3 gap-8">

{products.map((p)=>(

<ProductCard
key={p.name}
product={p}
/>

))}

</div>


</div>

</section>

)

}
