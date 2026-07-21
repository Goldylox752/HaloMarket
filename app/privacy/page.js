export const metadata = {
  title: "Privacy Policy | Halo Marketplace",
  description: "Halo Marketplace privacy policy."
};

export default function PrivacyPage() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-16">

      <h1 className="text-4xl font-black">
        Privacy Policy
      </h1>

      <p className="mt-4 text-gray-500">
        Last updated: {new Date().toLocaleDateString()}
      </p>


      <div className="mt-8 space-y-5 text-gray-700">

        <p>
          Halo Marketplace values your privacy. We collect information
          required to operate our marketplace, including account details,
          listings, and communication data.
        </p>

        <p>
          Your information is used to provide marketplace services,
          improve user experience, protect users, and maintain platform
          security.
        </p>

        <p>
          We do not sell your personal information. Information may only
          be shared when required to provide services or comply with legal
          obligations.
        </p>

        <p>
          You may request account deletion and removal of your personal
          data by contacting Halo Marketplace support.
        </p>

        <p>
          This privacy policy may be updated from time to time. Changes
          will be posted on this page.
        </p>

      </div>

    </main>
  );
}