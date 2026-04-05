import { useEffect } from "react";

const Maintenance = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex flex-col items-center justify-center px-4">
      {/* Logo */}
      <div className="mb-8 animate-fade-in">
        <img
          src="logo_pc.png"
          alt="Revive Wardrobe"
          className="h-20 w-auto"
        />
      </div>

      {/* Main Content */}
      <div className="text-center max-w-2xl mx-auto">
        {/* Heading */}
        <h1 className="text-4xl md:text-5xl font-serif text-revive-black mb-4">
          Website Under Maintenance
        </h1>

        {/* Decorative Line */}
        <div className="w-24 h-1 bg-revive-red mx-auto mb-8"></div>

        {/* Description */}
        <p className="text-lg text-gray-700 mb-6 leading-relaxed">
          We sincerely regret the inconvenience. Our website is currently undergoing essential maintenance and improvements to enhance your shopping experience.
        </p>

        {/* Additional Text */}
        <p className="text-gray-600 mb-8 leading-relaxed">
          We're working hard to bring you an even better Revive Wardrobe experience with new features, improved performance, and a more seamless journey through our collections.
        </p>

        {/* Contact Info */}
        <div className="bg-gray-100 rounded-lg p-6 mb-8">
          <p className="text-gray-700 mb-4">
            For urgent inquiries, please reach out to us:
          </p>
          <div className="space-y-3">
            <p className="text-gray-800">
              <strong>Email:</strong>{" "}
              <a
                href="mailto:info@revivewardrobe.com"
                className="text-revive-red hover:underline"
              >
                info@revivewardrobe.com
              </a>
            </p>
            <p className="text-gray-800">
              <strong>WhatsApp:</strong>{" "}
              <a
                href="https://wa.me/971582447684"
                target="_blank"
                rel="noopener noreferrer"
                className="text-revive-red hover:underline"
              >
                +971 58 244 7684
              </a>
            </p>
          </div>
        </div>

        {/* Footer Message */}
        <p className="text-gray-500 text-sm">
          Thank you for your patience and continued support. We'll be back shortly!
        </p>
      </div>

      {/* Animated Background */}
      <style>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.8s ease-out;
        }
      `}</style>
    </div>
  );
};

export default Maintenance;
