import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import supabase from "../supabaseClient";

export default function PublicResume() {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [resume, setResume] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchResume();
  }, []);

  const fetchResume = async () => {
    const { data, error } = await supabase
      .from("user_resumes")
      .select("resume_data")
      .eq("firebase_uid", userId)
      .single();

    if (error || !data?.resume_data) {
      setResume(null);
    } else {
      setResume(data.resume_data);
    }
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="p-6 bg-[#FFFAEC] min-h-screen flex justify-center items-center">
        <p>Loading resume...</p>
      </div>
    );
  }

  if (!resume) {
    return (
      <div className="p-6 bg-[#FFFAEC] min-h-screen flex justify-center items-center">
        <p>No resume found for this user.</p>
      </div>
    );
  }

  return (
    <div className="p-6 bg-[#FFFAEC] min-h-screen max-w-3xl mx-auto rounded-lg shadow-xl">
      <div className="text-center mb-6">
        {resume.profileImageUrl && (
          <img
            src={resume.profileImageUrl}
            alt="Profile"
            className="w-32 h-32 mx-auto rounded-full border-4 border-[#FFD24C] mb-3 object-cover"
          />
        )}
        <h1 className="text-3xl font-bold text-[#333333]">{resume.fullName}</h1>
        <p className="text-[#555555]">
          {resume.email} | {resume.phone}
        </p>
        {resume.portfolioLink && (
          <a
            href={resume.portfolioLink}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 underline mt-1 inline-block"
          >
            View Portfolio
          </a>
        )}
      </div>

      <div className="space-y-6">
        <Section title="Summary" content={resume.summary} />
        <Section title="Skills" content={resume.skills} />
        <Section title="Experience" content={resume.experience} />
        <Section title="Education" content={resume.education} />
        <Section title="Projects" content={resume.projects} />
      </div>
    </div>
  );
}

function Section({ title, content }) {
  if (!content) return null;
  return (
    <div className="bg-white p-4 rounded shadow-md">
      <h3 className="text-xl font-semibold text-[#333333] mb-2">{title}</h3>
      <p className="text-[#555555] whitespace-pre-wrap">{content}</p>
    </div>
  );
}
