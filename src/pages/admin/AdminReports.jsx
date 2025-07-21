import { useEffect, useState } from "react";
import supabase from "../../supabaseClient";

export default function AdminReports() {
  const [stats, setStats] = useState({
    totalJobs: 0,
    totalEmployers: 0,
    totalJobSeekers: 0,
    pendingJobs: 0,
  });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const { count: jobsCount } = await supabase
        .from("employer_jobs")
        .select("*", { count: "exact", head: true });

      const { count: employersCount } = await supabase
        .from("employer_profiles")
        .select("*", { count: "exact", head: true });

      const { count: jobSeekersCount } = await supabase
        .from("user_profiles")
        .select("*", { count: "exact", head: true });

      const { count: pendingJobsCount } = await supabase
        .from("employer_jobs")
        .select("*", { count: "exact", head: true })
        .eq("status", "Pending");

      setStats({
        totalJobs: jobsCount || 0,
        totalEmployers: employersCount || 0,
        totalJobSeekers: jobSeekersCount || 0,
        pendingJobs: pendingJobsCount || 0,
      });
    } catch (error) {
      console.error("Failed to fetch statistics:", error);
    }
  };

  return (
    <div className="p-6 bg-[#FFFAEC] min-h-screen">
      <div className="flex justify-center mt-4 mb-6">
        <h1 className="text-2xl font-semibold text-[#333333] border-2 border-[#FFD24C] rounded-full px-5 py-1 shadow-[0_0_10px_#FFD24C]">
          Platform Statistics
        </h1>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <StatCard
          label="Total Jobs Posted"
          value={stats.totalJobs}
          color="#FFD24C"
        />
        <StatCard
          label="Total Employers"
          value={stats.totalEmployers}
          color="#71C9CE"
        />
        <StatCard
          label="Total Job Seekers"
          value={stats.totalJobSeekers}
          color="#FF6F61"
        />
        <StatCard
          label="Pending Jobs"
          value={stats.pendingJobs}
          color="#6A5ACD"
        />
      </div>
    </div>
  );
}

function StatCard({ label, value, color }) {
  return (
    <div
      className={`bg-white p-4 rounded shadow text-center border-2`}
      style={{ borderColor: color }}
    >
      <h3 className="text-xl font-semibold text-[#333333]">{label}</h3>
      <p className="text-3xl font-bold mt-2" style={{ color: color }}>
        {value}
      </p>
    </div>
  );
}
