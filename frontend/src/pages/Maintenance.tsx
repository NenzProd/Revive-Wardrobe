import SEO from "@/components/SEO";

const Maintenance = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-100 via-white to-blue-50 flex items-center justify-center p-8">
      <SEO
        title="Site Under Maintenance | Revive Wardrobe"
        description="Revive Wardrobe is temporarily under maintenance. We'll be back soon with a fresh shopping experience."
        keywords="maintenance, under maintenance, coming back soon, revive wardrobe"
        canonical="/maintenance"
      />
      <div className="bg-white shadow-xl rounded-2xl border border-blue-100 max-w-2xl w-full p-8 text-center">
        <div className="mb-6">
          <span className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 text-blue-700 text-3xl font-bold">
            ⚙️
          </span>
        </div>
        <h1 className="text-4xl font-extrabold text-gray-900 mb-4">We'll be back soon</h1>
        <p className="text-lg text-gray-600 mb-6">
          Our website is currently undergoing scheduled maintenance to improve your experience.
          Thank you for your patience. Please check again shortly.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-3">
          <a
            href="/"
            className="px-6 py-3 font-semibold rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition"
          >
            Back to Home
          </a>
          <a
            href="mailto:support@revivewardrobe.com"
            className="px-6 py-3 font-semibold rounded-lg border border-blue-600 text-blue-600 hover:bg-blue-50 transition"
          >
            Contact Support
          </a>
        </div>
      </div>
    </div>
  );
};

export default Maintenance;
