export const metadata = {

  title: "Terms of Service | Halo Marketplace",

  description:
    "Halo Marketplace terms of service and user agreement."

};



export default function TermsPage() {

  return (

    <main className="mx-auto max-w-3xl px-6 py-16">


      <h1 className="text-3xl font-bold">
        Terms of Service
      </h1>


      <p className="mt-4 text-gray-500">
        Last updated: {new Date().toLocaleDateString()}
      </p>



      <p className="mt-6 text-gray-700">

        By using Halo Marketplace, you agree to use the platform
        responsibly and follow these terms.

      </p>



      <ul className="mt-6 ml-6 list-disc space-y-3 text-gray-700">

        <li>
          Users must provide accurate and lawful listing information.
        </li>


        <li>
          Users must not engage in fraud, scams, abuse, or illegal activity.
        </li>


        <li>
          Users must communicate respectfully with other members.
        </li>


        <li>
          Halo Marketplace provides a platform for buyers and sellers
          to connect. Transactions are agreements between users.
        </li>


        <li>
          Halo Marketplace is not responsible for disputes, losses,
          or issues between buyers and sellers.
        </li>


      </ul>



      <p className="mt-6 text-gray-700">

        Halo Marketplace reserves the right to restrict or suspend
        accounts that violate these terms.

      </p>


    </main>

  );

}