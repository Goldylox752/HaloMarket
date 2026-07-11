import Hero from "@/components/Hero";
import FeaturedSection from "@/components/FeaturedSection";


export default function Home(){


return (

<main>

<Hero />

<FeaturedSection />


<section className="bg-gray-100 py-20">

<div className="max-w-7xl mx-auto px-6 text-center">


<h2 className="text-5xl font-bold">

Sell Anything.
Reach Anyone.

</h2>


<p className="mt-5 text-xl text-gray-600">

Create your seller account and start reaching
customers across Canada.

</p>


<button className="mt-8 bg-indigo-600 text-white px-10 py-4 rounded-xl">

Become A Seller

</button>


</div>

</section>


</main>

)

}
