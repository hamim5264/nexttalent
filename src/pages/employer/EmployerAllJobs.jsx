import { useEffect, useState } from "react";
import supabase from "../../supabaseClient";

export default function EmployerAllJobs() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchApprovedJobs();
  }, []);

  const fetchApprovedJobs = async () => {
    const { data: jobs, error } = await supabase
      .from("employer_jobs")
      .select("*")
      .eq("status", "Approved")
      .order("created_at", { ascending: false });

    const uniqueUids = [...new Set(jobs.map((job) => job.firebase_uid))];

    const { data: profiles } = await supabase
      .from("employer_profiles")
      .select("firebase_uid, company_name")
      .in("firebase_uid", uniqueUids);

    const jobWithCompany = jobs.map((job) => {
      const profile = profiles.find((p) => p.firebase_uid === job.firebase_uid);
      return {
        ...job,
        company_name: profile?.company_name || "N/A",
      };
    });

    setJobs(jobWithCompany);
    setLoading(false);
  };

  return (
    <main className="p-4 sm:p-6 bg-[#FFFAEC] min-h-screen">
      <div className="flex justify-center mt-4 mb-6">
        <h1 className="text-2xl font-semibold text-[#333333] border-2 border-neon rounded-full px-5 py-1 shadow-[0_0_10px_#FFD24C]">
          Employer All Jobs
        </h1>
      </div>

      {loading ? (
        <div className="text-center text-gray-600">Loading...</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {jobs.map((job) => (
            <div
              key={job.id}
              className="bg-white p-4 rounded shadow border-2 border-neon"
            >
              <img
                src={job.image_url}
                alt={job.title}
                className="h-32 w-full object-cover rounded mb-3"
              />
              <h3 className="text-lg font-bold mb-1">{job.title}</h3>
              <p className="text-sm mb-1">
                <span className="font-bold">Company: </span>
                {job.company_name}
              </p>
              <p className="text-sm mb-1">
                <span className="font-bold">Location: </span>
                {job.location || "N/A"}
              </p>
              <p className="text-sm mb-1">
                <span className="font-bold">Salary: </span>
                {job.salary || "N/A"}
              </p>
              <p className="text-sm mb-1">
                <span className="font-bold">Deadline: </span>
                {job.application_deadline || "N/A"}
              </p>
              <p className="text-sm mb-1">
                <span className="font-bold">Skills: </span>
                {job.required_skills?.join(", ") ||
                  "No skills provided from company"}
              </p>
              <p className="text-sm">
                <span className="font-bold">Status: </span>
                <span className="text-green-600">{job.status}</span>
              </p>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
