import { Link } from "react-router-dom";

export default function LandingPage() {
  return (
    <div
      className="min-h-screen flex flex-col text-[#333333] relative overflow-hidden"
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1607082349566-18736c627699?auto=format&fit=crop&w=1470&q=80')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-[#FFFAEC]/80 to-[#FFD24C]/80 backdrop-blur-sm z-0"></div>

      <div className="relative z-10 flex flex-col min-h-screen">
        <div className="flex justify-between items-center p-6">
          <h1 className="text-3xl font-extrabold tracking-wide">NextTalent</h1>
          <nav className="space-x-6 text-lg">
            <Link
              to="/login"
              className="hover:text-yellow-500 transition-colors"
            >
              Login
            </Link>
            <Link
              to="/signup"
              className="hover:text-yellow-500 transition-colors"
            >
              Sign Up
            </Link>
          </nav>
        </div>

        <main className="flex flex-col items-center justify-center text-center py-20 px-4 flex-grow">
          <h2 className="text-4xl sm:text-5xl font-bold mb-4">
            Discover. Develop. Deliver.
          </h2>
          <p className="text-lg sm:text-xl mb-8 max-w-2xl">
            NextTalent helps you find your dream job, improve your skills, and
            connect with top companies around the world.
          </p>
          <Link
            to="/login"
            className="border-2 border-yellow-400 text-black px-6 py-3 rounded-lg text-lg font-semibold hover:scale-105 transition-transform animate-pulse"
          >
            Get Started 🚀
          </Link>
        </main>

        <section className="bg-white bg-opacity-90 py-12 px-6 text-center">
          <h3 className="text-3xl font-semibold mb-4">
            🌟 Why Choose NextTalent?
          </h3>
          <p className="max-w-3xl mx-auto text-[#555555] mb-6 text-justify">
            NextTalent isn't just another job platform — it's a career
            accelerator. We connect talent with the right opportunities through
            personalized job matches, skill-building resources, and a seamless
            application process. Our verified employers ensure safe, authentic
            openings, and our real-time interview scheduling keeps candidates
            ahead in their career journey. Whether you're a fresh graduate or a
            seasoned professional,
            <span className="font-bold"> NextTalent </span>
            is designed to help you land the job you deserve — faster, smarter,
            and better.
          </p>
        </section>

        <footer className="text-center py-4 mt-auto text-sm tracking-wide">
          &copy; {new Date().getFullYear()} NextTalent | Powered by DevEngine
        </footer>
      </div>
    </div>
  );
}
