export const metadata = {

title:
"Support Halo Market | Help Keep Marketplace Free",

description:
"Support Halo Market and help us maintain a free, secure marketplace for buyers and sellers across Canada.",

};



export default function SupportPage(){


return (

<main className="min-h-screen bg-white text-slate-900">



<section className="bg-black px-6 py-24 text-center text-white">


<h1 className="text-5xl font-black md:text-6xl">

Support Halo Market

</h1>


<p className="mx-auto mt-6 max-w-3xl text-xl text-gray-300">

Help us keep Halo Market free, secure, and accessible
for buyers and sellers across Canada.

</p>


</section>







<section className="mx-auto max-w-6xl px-6 py-20">


<div className="text-center">


<h2 className="text-4xl font-black">

Build The Future Of Local Commerce

</h2>


<p className="mx-auto mt-6 max-w-3xl text-lg text-gray-600">

Halo Market is designed to give Canadians a simple
way to buy and sell without expensive fees.
Your support helps cover hosting, development,
security, and new features.

</p>


</div>







<div className="mt-12 grid gap-6 md:grid-cols-3">



<div className="rounded-3xl border p-8 text-center">

<div className="text-4xl">
☁️
</div>

<h3 className="mt-4 text-xl font-bold">

Hosting

</h3>

<p className="mt-3 text-gray-600">

Keep Halo Market fast, reliable, and online.

</p>

</div>





<div className="rounded-3xl border p-8 text-center">

<div className="text-4xl">
🚀
</div>

<h3 className="mt-4 text-xl font-bold">

Development

</h3>

<p className="mt-3 text-gray-600">

Help us build new marketplace features.

</p>

</div>





<div className="rounded-3xl border p-8 text-center">

<div className="text-4xl">
🔒
</div>

<h3 className="mt-4 text-xl font-bold">

Security

</h3>

<p className="mt-3 text-gray-600">

Maintain a safer buying and selling experience.

</p>

</div>


</div>








<section className="mt-16 rounded-3xl bg-indigo-600 p-10 text-center text-white">


<h2 className="text-3xl font-black">

Become A Halo Supporter

</h2>


<p className="mt-4 text-lg text-indigo-100">

Every contribution helps keep Halo Market free.

</p>





<div className="mt-8 flex flex-wrap justify-center gap-4">


<a

href="YOUR_STRIPE_PAYMENT_LINK"

className="rounded-xl bg-white px-8 py-4 font-bold text-indigo-600 hover:bg-gray-100"

>

Donate $5

</a>



<a

href="YOUR_STRIPE_PAYMENT_LINK"

className="rounded-xl bg-white px-8 py-4 font-bold text-indigo-600 hover:bg-gray-100"

>

Donate $10

</a>



<a

href="YOUR_STRIPE_PAYMENT_LINK"

className="rounded-xl bg-white px-8 py-4 font-bold text-indigo-600 hover:bg-gray-100"

>

Donate $25

</a>


</div>


</section>







<p className="mt-12 text-center text-sm text-gray-500">

Thank you for supporting Halo Market and helping us
build a better marketplace.

</p>




</section>


</main>

);

}