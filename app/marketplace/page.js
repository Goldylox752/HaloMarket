import ProductCard from "@/components/ProductCard";
import SearchBar from "@/components/SearchBar";
import CategoryCard from "@/components/CategoryCard";


export default function MarketplacePage() {

  const products = [
    {
      id: 1,
      title: "MacBook Pro M3",
      price: "$1,899",
      location: "Edmonton, AB",
      image: "💻"
    },
    {
      id: 2,
      title: "Toyota Tacoma",
      price: "$34,500",
      location: "Calgary, AB",
      image: "🚙"
    },
    {
      id: 3,
      title: "Gaming Setup",
      price: "$2,200",
      location: "Toronto, ON",
      image: "🎮"
    }
  ];


  const categories = [
    {
      title: "Electronics",
      icon: "📱"
    },
    {
      title: "Vehicles",
      icon: "🚗"
    },
    {
      title: "Home",
      icon: "🏠"
    },
    {
      title: "Fashion",
      icon: "👕"
    }
  ];


  return (

    <main className="min-h-screen bg-gray-50 px-6 py-16">

      <div className="max-w-7xl mx-auto">


        <h1 className="text-5xl font-bold">
          Browse Marketplace
        </h1>

        <p className="mt-4 text-gray-600">
          Discover products from sellers across Canada.
        </p>


        <div className="mt-8">
          <SearchBar />
        </div>



        <section className="mt-12">

          <h2 className="text-3xl font-bold">
            Categories
          </h2>


          <div className="mt-6 grid md:grid-cols-4 gap-6">

            {categories.map((category)=>(
              <CategoryCard
                key={category.title}
                {...category}
              />
            ))}

          </div>

        </section>



        <section className="mt-16">

          <h2 className="text-3xl font-bold">
            Featured Products
          </h2>


          <div className="mt-8 grid md:grid-cols-3 gap-8">

            {products.map((product)=>(
              <ProductCard
                key={product.id}
                {...product}
              />
            ))}

          </div>

        </section>


      </div>

    </main>

  );
}
