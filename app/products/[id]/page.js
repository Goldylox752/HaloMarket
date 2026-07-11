import { supabase } from "@/lib/supabase";
import Image from "next/image";


async function getProduct(id) {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    return null;
  }

  return data;
}


export default async function ProductPage({ params }) {

  const product = await getProduct(params.id);


  if (!product) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <h1 className="text-3xl font-bold">
          Product Not Found
        </h1>
      </main>
    );
  }


  return (
    <main className="max-w-7xl mx-auto px-6 py-16">

      <div className="grid md:grid-cols-2 gap-12">


        {/* Product Image */}

        <div className="rounded-3xl overflow-hidden bg-gray-100">

          {product.image_url ? (

            <Image
              src={product.image_url}
              alt={product.name}
              width={800}
              height={800}
              className="w-full h-[500px] object-cover"
            />

          ) : (

            <div className="h-[500px] flex items-center justify-center">
              No Image Available
            </div>

          )}

        </div>



        {/* Product Information */}

        <div>

          <p className="text-blue-600 font-semibold">
            {product.category}
          </p>


          <h1 className="text-5xl font-black mt-3">
            {product.name}
          </h1>


          <p className="text-gray-600 text-lg mt-6">
            {product.description}
          </p>



          <div className="mt-8">

            <h2 className="text-4xl font-bold">
              ${product.price} CAD
            </h2>

          </div>



          <div className="mt-8 border rounded-2xl p-6">

            <h3 className="font-bold text-lg">
              Seller Information
            </h3>

            <p className="text-gray-600 mt-2">
              Location: {product.location}
            </p>

          </div>




          <div className="mt-8 flex gap-4">


            <button
              className="bg-black text-white px-8 py-4 rounded-xl font-bold hover:bg-gray-800"
            >
              Buy Now
            </button>



            <button
              className="border px-8 py-4 rounded-xl font-bold hover:bg-gray-100"
            >
              Add To Cart
            </button>


          </div>



        </div>


      </div>


    </main>
  );
}
