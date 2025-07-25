import { useState } from "react";
import supabase from "../../supabaseClient";
import { getAuth } from "firebase/auth";
import {
  notifySpecificUser,
  notifyRole,
  notifyAllUsers,
} from "../../services/notificationService";
const ADMIN_UID = import.meta.env.VITE_ADMIN_UID;

export default function PostJob() {
  const [form, setForm] = useState({
    title: "",
    location: "",
    salary: "",
    imageUrl: "",
    description: "",
    requiredSkills: [],
    deadline: "",
  });
  const skillOptions = [
    "No skill required",
    "Fresher can apply",
    "JavaScript",
    "Express.js",
    "Dart",
    "Ruby",
    "Firbase",
    " Tailwind CSS",
    "Flutter",
    "HTML",
    "MERN Stack",
    "C++",
    "Java",
    "C#",
    "MongoDB",
    "API Integration",
    "Python",
    "React",
    "Node.js",
    "SQL",
    "Figma",
    "Adobe XD",
    "Prototyping",
    "Design Systems",
    "Cypress",
    "Selenium",
    "Postman",
    "Test Cases",
    "REST API",
    "Communication",
    "Teamwork",
    "Graphic Design",
    "Marketing",
    "Sales",
    "Nursing",
    "Data Analysis",
    "Project Management",
    "AutoCAD",
    "Electrical Engineering",
    "Medical Knowledge",
  ];

  const auth = getAuth();
  const user = auth.currentUser;

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSkillChange = (skill) => {
    setForm((prev) => ({
      ...prev,
      requiredSkills: prev.requiredSkills.includes(skill)
        ? prev.requiredSkills.filter((s) => s !== skill)
        : [...prev.requiredSkills, skill],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      alert("User not logged in.");
      return;
    }

    try {
      const { error } = await supabase.from("employer_jobs").insert([
        {
          firebase_uid: user.uid,
          title: form.title,
          location: form.location,
          salary: form.salary,
          image_url: form.imageUrl,
          description: form.description,
          status: "Pending",
          required_skills:
            form.requiredSkills.length > 0
              ? form.requiredSkills
              : ["no skills provided from company"],
          application_deadline: form.deadline || null,
        },
      ]);

      if (error) {
        console.error("Error posting job:", error);
        alert("Failed to post job.");
        return;
      }

      await notifySpecificUser(
        ADMIN_UID,
        "admin",
        "New Job Posted",
        `An employer has posted a new job: "${form.title}". Please review and approve.`
      );

      alert(
        `Job "${form.title}" posted successfully! Awaiting Admin Approval.`
      );

      setForm({
        title: "",
        location: "",
        salary: "",
        imageUrl: "",
        description: "",
        requiredSkills: [],
        deadline: "",
      });
    } catch (err) {
      console.error("Unexpected error posting job:", err);
      alert("An unexpected error occurred while posting the job.");
    }
  };

  return (
    <div className="p-6 bg-[#FFFAEC] min-h-screen flex items-center justify-center">
      <div className="bg-white p-8 rounded shadow max-w-2xl w-full">
        <div className="flex justify-center mt-4 mb-6">
          <h1 className="text-2xl font-semibold text-[#333333] border-2 border-[#FFD24C] rounded-full px-5 py-1 shadow-[0_0_10px_#FFD24C]">
            Post a New Job
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <FormField
            label="Job Title"
            name="title"
            value={form.title}
            onChange={handleChange}
            placeholder="Enter job title"
            required
          />
          <FormField
            label="Location"
            name="location"
            value={form.location}
            onChange={handleChange}
            placeholder="Enter location"
            required
          />
          <FormField
            label="Salary"
            name="salary"
            value={form.salary}
            onChange={handleChange}
            placeholder="Enter salary range"
          />
          <FormField
            label="Image URL"
            name="imageUrl"
            value={form.imageUrl}
            onChange={handleChange}
            placeholder="Enter image URL for the job"
          />
          <div>
            <label className="block text-[#333333] font-medium mb-1">
              Job Description
            </label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              className="w-full p-3 border rounded"
              placeholder="Enter job description"
              rows="4"
            ></textarea>
          </div>

          <div>
            <label className="block text-[#333333] font-medium mb-1">
              Required Skills
            </label>
            <div className="flex flex-wrap gap-2">
              {skillOptions.map((skill) => (
                <label key={skill} className="text-sm flex items-center gap-1">
                  <input
                    type="checkbox"
                    value={skill}
                    checked={form.requiredSkills.includes(skill)}
                    onChange={() => handleSkillChange(skill)}
                  />
                  {skill}
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-[#333333] font-medium mb-1">
              Deadline (Last Date of Application)
            </label>
            <input
              type="date"
              name="deadline"
              value={form.deadline}
              onChange={handleChange}
              className="w-full p-3 border rounded"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-[#FFD24C] text-[#333333] font-semibold py-3 rounded hover:bg-[#FFE9B5] transition"
          >
            Post Job
          </button>
        </form>
      </div>
    </div>
  );
}

function FormField({ label, name, value, onChange, placeholder, required }) {
  return (
    <div>
      <label className="block text-[#333333] font-medium mb-1">{label}</label>
      <input
        type="text"
        name={name}
        value={value}
        onChange={onChange}
        className="w-full p-3 border rounded"
        placeholder={placeholder}
        required={required}
      />
    </div>
  );
}
