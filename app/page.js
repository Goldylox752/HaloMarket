export default function Home() {
  return (
    <main className="min-h-screen bg-white text-gray-900">

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-indigo-700 via-purple-700 to-blue-600 text-white">
        <div className="max-w-7xl mx-auto px-6 py-24 lg:flex lg:items-center lg:justify-between">

          <div className="max-w-3xl">

            <span className="inline-block mb-5 rounded-full bg-white/20 px-4 py-2 text-sm font-medium">
              🇨🇦 Canada's AI Powered Marketplace
            </span>

            <h1 className="text-5xl md:text-7xl font-bold leading-tight">
              Buy. Sell. Grow.
              <br />
              Welcome to{" "}
              <span className="text-yellow-300">
                Halo Marketplace
              </span>
            </h1>

            <p className="mt-6 text-xl text-white/90">
              A next-generation marketplace connecting buyers and sellers
              across Canada with secure payments, AI recommendations,
              real-time messaging, and powerful seller tools.
            </p>

            <div className="mt-10 flex flex-wrap gap-4">

              <button className="rounded-xl bg-white px-8 py-4 text-lg font-semibold text-indigo-700 shadow-lg hover:bg-gray-100">
                Start Shopping
              </button>

              <button className="rounded-xl border border-white/50 px-8 py-4 text-lg font-semibold hover:bg-white/10">
                Sell Your Products
              </button>

            </div>

          </div>


          <div className="hidden lg:block">
            <div className="rounded-3xl bg-white/10 p-10 backdrop-blur">

              <div className="grid grid-cols-2 gap-6">

                <div className="rounded-2xl bg-white/20 p-6">
                  <h3 className="text-3xl font-bold">
                    AI
                  </h3>
                  <p>
                    Smart Recommendations
                  </p>
                </div>

                <div className="rounded-2xl bg-white/20 p-6">
                  <h3 className="text-3xl font-bold">
                    24/7
                  </h3>
                  <p>
                    Marketplace
                  </p>
                </div>

                <div className="rounded-2xl bg-white/20 p-6">
                  <h3 className="text-3xl font-bold">
                    🔒
                  </h3>
                  <p>
                    Secure Payments
                  </p>
                </div>

                <div className="rounded-2xl bg-white/20 p-6">
                  <h3 className="text-3xl font-bold">
                    ⚡
                  </h3>
                  <p>
                    Fast Selling
                  </p>
                </div>

              </div>

            </div>
          </div>

        </div>
      </section>


      {/* Categories */}
      <section className="max-w-7xl mx-auto px-6 py-20">

        <h2 className="text-4xl font-bold text-center">
          Explore Categories
        </h2>

        <p className="mt-4 text-center text-gray-600">
          Everything you need in one marketplace.
        </p>


        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">

          {[
            ["📱 Electronics", "Phones, computers, gadgets"],
            ["🚗 Vehicles", "Cars, trucks, motorcycles"],
            ["🏠 Home", "Furniture and property"],
            ["👕 Fashion", "Clothing and accessories"],
          ].map((item) => (

            <div
              key={item[0]}
              className="rounded-2xl border bg-white p-8 shadow-sm hover:shadow-xl transition"
            >

              <h3 className="text-xl font-bold">
                {item[0]}
              </h3>

              <p className="mt-3 text-gray-600">
                {item[1]}
              </p>

            </div>

          ))}

        </div>

      </section>



      {/* Features */}
      <section className="bg-gray-100 py-20">

        <div className="max-w-7xl mx-auto px-6">

          <h2 className="text-4xl font-bold text-center">
            Marketplace Built For The Future
          </h2>


          <div className="mt-12 grid gap-8 md:grid-cols-3">


            <Feature
              icon="🤖"
              title="AI Shopping Assistant"
              text="Personalized recommendations help buyers find products faster."
            />


            <Feature
              icon="💬"
              title="Real-Time Chat"
              text="Buyers and sellers communicate instantly through secure messaging."
            />


            <Feature
              icon="💳"
              title="Secure Payments"
              text="Integrated payment processing keeps transactions protected."
            />


          </div>

        </div>

      </section>



      {/* CTA */}
      <section className="py-24 text-center">

        <h2 className="text-5xl font-bold">
          Ready to join Halo?
        </h2>

        <p className="mt-5 text-xl text-gray-600">
          Create your account and start buying or selling today.
        </p>


        <button className="mt-8 rounded-xl bg-indigo-600 px-10 py-4 text-lg font-semibold text-white hover:bg-indigo-700">
          Create Account
        </button>


      </section>


    </main>
  );
}



function Feature({ icon, title, text }) {

  return (

    <div className="rounded-2xl bg-white p-8 shadow">

      <div className="text-4xl">
        {icon}
      </div>

      <h3 className="mt-5 text-2xl font-bold">
        {title}
      </h3>

      <p className="mt-3 text-gray-600">
        {text}
      </p>

    </div>

  );

}
