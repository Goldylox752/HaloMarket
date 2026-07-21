export default function TermsPage() {
  return (
    <main className="max-w-3xl mx-auto px-6 py-16">
      <h1 className="text-3xl font-bold">Terms of Service</h1>
      <p className="mt-4">Last updated: {new Date().toLocaleDateString()}</p>
      <p className="mt-4">By using Halo Marketplace, you agree to:</p>
      <ul className="list-disc ml-6 mt-2 space-y-2">
        <li>Post accurate and lawful listings.</li>
        <li>Not engage in fraudulent or abusive behaviour.</li>
        <li>Communicate respectfully with other users.</li>
        <li>Understand that Halo facilitates connections; all transactions are between buyer and seller.</li>
        <li>Accept that Halo is not liable for disputes or losses.</li>
      </ul>
      <p className="mt-4">We reserve the right to suspend accounts that violate these terms.</p>
    </main>
  );
}