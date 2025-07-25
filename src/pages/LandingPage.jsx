import { Link } from "react-router-dom";
import whyImg from "../assets/why.svg";

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
            className="relative inline-block px-6 py-3 rounded-2xl text-lg font-semibold text-black border-2 border-yellow-400 hover:scale-105 transition-transform overflow-hidden group"
          >
            <span className="absolute inset-0 bg-gradient-to-r from-yellow-400 via-orange-400 to-yellow-400 animate-pulse rounded-2xl opacity-40 group-hover:opacity-60"></span>
            <span className="relative z-10">Get Started</span>
          </Link>
        </main>

        <section className="bg-white bg-opacity-90 py-12 px-6 text-center">
          <img
            src={whyImg}
            alt="Hiring Growth"
            className="mx-auto w-40 h-40 md:w-40 md:h-40 object-contain mb-4"
          />
          <h1 className="text-2xl md:text-3xl font-bold text-center mb-6 bg-gradient-to-r from-yellow-500 via-orange-500 to-pink-500 bg-clip-text text-transparent animate-pulse">
            Why Choose NextTalent?
          </h1>

          <p className="max-w-2xl mx-auto text-[#555555] mb-6 text-center">
            <span className="font-bold">NextTalent</span> helps you land the
            right job faster with personalized matches, verified employers, and
            real-time interview scheduling. Whether you're starting out or
            growing your career, we make the hiring journey smarter and easier.
          </p>
        </section>

        <footer className="text-center py-4 mt-auto text-sm tracking-wide">
          &copy; {new Date().getFullYear()} NextTalent | Powered by DevEngine
        </footer>
      </div>
    </div>
  );
}
