import lead from "../assets/lead.png";
import dev1 from "../assets/dev1.png";
import dev2 from "../assets/dev2.png";
import dev3 from "../assets/dev3.png";
import dev4 from "../assets/dev4.png";

export default function AboutUs() {
  const otherDevelopers = [
    {
      img: dev1,
      name: "NIME ULLAHA SHANTO",
      title: "App Developer & Designer",
      subtitle: "Flutter & Web Design Specialist",
    },
    {
      img: dev4,
      name: "SHAHRIMA SIKDER RIPA",
      title: "Frontend Developer",
      subtitle: "React Expert",
    },
    {
      img: dev3,
      name: "NOWAZESH KOBIR RIFAT",
      title: "Backend Developer",
      subtitle: "Server-Side Specialist",
    },
    {
      img: dev2,
      name: "RAFIUL ISLAM RAFI",
      title: "UI/UX Designer",
      subtitle: "Product Designer Specialist",
    },
  ];

  return (
    <div className="p-6 bg-[#FFFAEC] min-h-screen">
      <div className="flex justify-center mt-4 mb-6">
        <h1 className="text-2xl font-semibold text-[#333333] border-2 border-[#FFD24C] rounded-full px-5 py-1 shadow-[0_0_10px_#FFD24C]">
          About Us
        </h1>
      </div>

      <p className="text-[#555555] text-justify max-w-4xl mx-auto mb-12 text-lg leading-relaxed">
        Welcome to NextTalent, your ultimate destination for job seekers and
        employers! Our mission is to bridge the gap between talent and
        opportunity through a seamless, secure, and user-friendly platform.
        Whether you're looking to build your career or find the right talent for
        your company, NextTalent is here to support you every step of the way.
      </p>

      <div className="flex justify-center mt-4 mb-6">
        <h2 className="text-2xl font-semibold text-[#333333] border-2 border-[#FFD24C] rounded-full px-5 py-1 shadow-[0_0_10px_#FFD24C]">
          Our Developers
        </h2>
      </div>

      {/* Lead Developer */}
      <div className="max-w-sm mx-auto bg-white p-6 rounded shadow border-2 border-[#FFD24C] neon-input text-center mb-10">
        <img
          src={lead}
          alt="ABDUL HAMIM LEON"
          className="w-28 h-28 mx-auto object-cover rounded-full border mb-3"
        />
        <h3 className="text-xl font-bold text-[#333333]">ABDUL HAMIM LEON</h3>
        <p className="text-[#555555]">Full Stack Software & Web Developer</p>
        <p className="text-sm text-[#777777]">
          Team Lead || Software & Web Specialist
        </p>
      </div>

      {/* Other Developers */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-4xl mx-auto">
        {otherDevelopers.map((dev, index) => (
          <div
            key={index}
            className="bg-white p-4 rounded shadow border-2 border-[#FFD24C] neon-input text-center"
          >
            <img
              src={dev.img}
              alt={dev.name}
              className="w-24 h-24 mx-auto object-cover rounded-full border mb-2"
            />
            <h3 className="text-lg font-bold text-[#333333]">{dev.name}</h3>
            <p className="text-[#555555]">{dev.title}</p>
            <p className="text-sm text-[#777777]">{dev.subtitle}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
