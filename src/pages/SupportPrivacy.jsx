import CompanyLogo from "../assets/com_logo.png";

export default function SupportPrivacy() {
  return (
    <div className="p-6 bg-[#FFFAEC] min-h-screen">
      <div className="flex justify-center mt-4 mb-6">
        <h1 className="text-2xl font-semibold text-[#333333] border-2 border-[#FFD24C] rounded-full px-5 py-1 shadow-[0_0_10px_#FFD24C]">
          🔐 Support & Privacy
        </h1>
      </div>

      <div className="max-w-3xl mx-auto space-y-6 bg-white p-6 rounded shadow border-2 border-[#FFD24C] neon-input">
        <p className="text-[#555555] text-justify">
          At NextTalent, we are committed to protecting your data and privacy.
          All your information is stored securely, and we never share your
          personal data with any third party without your consent. Both users
          and employers can safely use our platform to connect, apply, and
          recruit talents globally.
        </p>

        <h2 className="text-xl font-bold mt-4 text-[#333333]">📞 Support</h2>
        <p className="text-[#555555]">
          For any queries or support, feel free to reach out to us:
        </p>

        <div className="flex items-center space-x-4">
          <img
            src={CompanyLogo}
            alt="Company Logo"
            className="w-12 h-12 object-contain"
          />
          <div className="text-[#333333]">
            <p>
              <strong>Company:</strong> DevEngine
            </p>
            <p>
              <strong>Email:</strong> devenginesoftsolution@gmail.com
            </p>
            <p>
              <strong>Website:</strong>{" "}
              <a
                href="https://devengine-three.vercel.app/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 underline"
              >
                www.devengine.com
              </a>
            </p>
            <p>
              <strong>Contact:</strong> +880 1724 879284
            </p>
          </div>
        </div>

        <hr className="border-[#FFD24C] my-4" />

        <p className="text-center text-sm text-[#777777]">
          © 2025 DevEngine. All rights reserved. Unauthorized reproduction or
          distribution of any content is strictly prohibited.
        </p>
      </div>
    </div>
  );
}
