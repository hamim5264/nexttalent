import { useEffect, useState } from "react";
import supabase from "../../supabaseClient";
import EmployerSidebar from "../../components/employer/EmployerSidebar";
import EmployerHeader from "../../components/employer/EmployerHeader";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { getAuth } from "firebase/auth";
import { Menu } from "lucide-react";

export default function EmployerDashboard() {
  const auth = getAuth();
  const user = auth.currentUser;

  const [counts, setCounts] = useState({
    totalJobs: 0,
    applicants: 0,
    interviews: 0,
  });
  const [postedJobs, setPostedJobs] = useState([]);
  const [allJobs, setAllJobs] = useState([]);
  const [trendingJobs, setTrendingJobs] = useState([]);
  const [interviews, setInterviews] = useState([]);
  const [newsFeed, setNewsFeed] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    if (user) {
      loadDashboard();
    }
  }, [user]);

  const loadDashboard = async () => {
    setLoading(true);
    await Promise.all([
      fetchCounts(),
      fetchPostedJobs(),
      fetchAllJobs(),
      fetchTrendingJobs(),
      fetchInterviews(),
      fetchNewsFeed(),
      fetchReviews(),
    ]);
    setLoading(false);
  };

  const fetchCounts = async () => {
    const { count: jobsCount } = await supabase
      .from("employer_jobs")
      .select("*", { count: "exact", head: true })
      .eq("firebase_uid", user.uid);

    const { count: applicantsCount } = await supabase
      .from("user_applied_jobs")
      .select("*", { count: "exact", head: true })
      .in("job_id", await getEmployerJobIds());

    const { count: interviewsCount } = await supabase
      .from("interview_schedules")
      .select("*", { count: "exact", head: true })
      .in("applied_job_id", await getEmployerAppliedJobIds());

    setCounts({
      totalJobs: jobsCount || 0,
      applicants: applicantsCount || 0,
      interviews: interviewsCount || 0,
    });
  };

  const getEmployerJobIds = async () => {
    const { data } = await supabase
      .from("employer_jobs")
      .select("id")
      .eq("firebase_uid", user.uid);
    return data?.map((job) => job.id) || [];
  };

  const getEmployerAppliedJobIds = async () => {
    const jobIds = await getEmployerJobIds();
    const { data } = await supabase
      .from("user_applied_jobs")
      .select("id, job_id")
      .in("job_id", jobIds);
    return data?.map((app) => app.id) || [];
  };

  const fetchPostedJobs = async () => {
    const { data: jobs, error: jobsError } = await supabase
      .from("employer_jobs")
      .select("*")
      .eq("firebase_uid", user.uid);

    if (jobsError) {
      console.error("Error fetching posted jobs:", jobsError);
      return;
    }

    const { data: profile, error: profileError } = await supabase
      .from("employer_profiles")
      .select("company_name")
      .eq("firebase_uid", user.uid)
      .single();

    const companyName = profile?.company_name || "N/A";

    const jobsWithCompany = jobs.map((job) => ({
      ...job,
      company_name: companyName,
    }));

    setPostedJobs(jobsWithCompany);
  };

  const fetchAllJobs = async () => {
    const { data: jobs, error } = await supabase
      .from("employer_jobs")
      .select("*")
      .eq("status", "Approved")
      .order("created_at", { ascending: false })
      .limit(10);

    if (error) {
      console.error("Failed to fetch all jobs:", error);
      return;
    }

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

    setAllJobs(jobWithCompany);
  };

  const fetchTrendingJobs = async () => {
    const { data: appliedJobs } = await supabase
      .from("user_applied_jobs")
      .select("job_id");

    const jobFrequency = appliedJobs.reduce((acc, { job_id }) => {
      acc[job_id] = (acc[job_id] || 0) + 1;
      return acc;
    }, {});

    const trendingJobIds = Object.keys(jobFrequency)
      .filter((id) => jobFrequency[id] >= 2)
      .slice(0, 6);

    const { data: jobs } = await supabase
      .from("employer_jobs")
      .select("*")
      .in("id", trendingJobIds);

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

    setTrendingJobs(jobWithCompany);
  };

  const fetchInterviews = async () => {
    const appliedJobIds = await getEmployerAppliedJobIds();
    const today = new Date().toISOString().split("T")[0];

    const { data } = await supabase
      .from("interview_schedules")
      .select("*")
      .in("applied_job_id", appliedJobIds)
      .gte("interview_date", today);

    setInterviews(data || []);
  };

  const fetchNewsFeed = async () => {
    const { data } = await supabase.from("news_feed").select("*");
    setNewsFeed(data || []);
  };

  const fetchReviews = async () => {
    const { data } = await supabase.from("user_reviews").select("*");
    setReviews(data || []);
  };

  const chartData = [
    { name: "Jobs", value: counts.totalJobs, color: "#FFD24C" },
    { name: "Applicants", value: counts.applicants, color: "#71C9CE" },
    { name: "Interviews", value: counts.interviews, color: "#FF6F61" },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-yellow-300 via-white to-yellow-200 bg-opacity-60 backdrop-blur-sm">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-yellow-400"></div>
      </div>
    );
  }

  return (
    <div className="flex h-screen">
      <div className="hidden md:block">
        <EmployerSidebar />
      </div>

      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        >
          <div className="absolute left-0 top-0 bg-white w-64 h-full shadow-lg">
            <EmployerSidebar />
          </div>
        </div>
      )}

      <div className="flex-1 flex flex-col">
        <div className="flex justify-between items-center p-4 bg-gradient-to-r from-yellow-300 to-yellow-100 shadow-md md:hidden">
          <Menu
            className="w-6 h-6 text-[#333333]"
            onClick={() => setIsSidebarOpen(true)}
          />
          <h2 className="text-lg font-bold text-[#333333]">
            Employer Dashboard
          </h2>
          <div></div>
        </div>

        <EmployerHeader />

        <main className="p-4 sm:p-6 bg-[#FFFAEC] flex-1 overflow-auto">
          <h1 className="text-2xl md:text-3xl font-bold text-center mb-6 bg-gradient-to-r from-yellow-500 via-orange-500 to-pink-500 bg-clip-text text-transparent animate-pulse">
            Let’s Grow Your Hiring Journey
          </h1>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <StatCard title="Total Jobs Posted" value={counts.totalJobs} />
            <StatCard title="Applicants" value={counts.applicants} />
            <StatCard title="Interviews Scheduled" value={counts.interviews} />
          </div>
          <section className="bg-white p-4 rounded shadow mb-6 border-2 border-neon">
            <h2 className="text-xl font-semibold text-center mb-4">
              Platform Statistics
            </h2>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={chartData}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value">
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </section>

          <SectionCard title="Your Posted Jobs">
            {postedJobs.map((job) => (
              <JobCard key={job.id} job={job} companyName={job.company_name} />
            ))}
          </SectionCard>

          <SectionCard title="All Jobs">
            {allJobs.map((job) => (
              <JobCard key={job.id} job={job} companyName={job.company_name} />
            ))}
          </SectionCard>

          <SectionCard title="Trending Jobs">
            {trendingJobs.map((job) => (
              <JobCard key={job.id} job={job} companyName={job.company_name} />
            ))}
          </SectionCard>

          <SectionCard title="Interview Schedules">
            {interviews.map((interview) => (
              <div
                key={interview.id}
                className="bg-white p-3 rounded border shadow border-neon"
              >
                <p>Date: {interview.interview_date}</p>
                <p>Time: {interview.interview_time}</p>
                <p>
                  Link:{" "}
                  <a
                    href={interview.meeting_link}
                    className="text-blue-500 underline"
                  >
                    Join
                  </a>
                </p>
              </div>
            ))}
          </SectionCard>
          <SectionCard title="NextTalent News">
            {newsFeed.map((news) => (
              <div
                key={news.id}
                className="bg-white p-3 rounded border shadow border-neon"
              >
                <img
                  src={news.image_url}
                  alt={news.title}
                  className="h-32 w-full object-cover mb-2 rounded"
                />
                <h4 className="font-bold">{news.title}</h4>
                <p className="text-sm">{news.description}</p>
              </div>
            ))}
          </SectionCard>
          <SectionCard title="Reviews">
            {reviews.map((review) => (
              <div
                key={review.id}
                className="bg-white p-3 rounded border shadow border-neon"
              >
                <p>{review.review_text}</p>
                <p>Rating: {review.rating} ⭐</p>
              </div>
            ))}
          </SectionCard>

          <footer className="text-center text-sm text-[#555555] mt-10">
            © 2025 NextTalent || Powered By DevEngine - All rights reserved.
          </footer>
        </main>
      </div>
    </div>
  );
}

function StatCard({ title, value }) {
  return (
    <div className="bg-white p-4 rounded shadow text-center border-2 border-neon hover:scale-105 transition-transform">
      <h3 className="text-lg font-medium text-[#333333]">{title}</h3>
      <p className="text-3xl font-bold mt-2 text-[#FFD24C]">{value}</p>
    </div>
  );
}

function SectionCard({ title, children }) {
  return (
    <section className="mb-8">
      <h2 className="text-xl font-semibold mb-4 text-[#333333]">{title}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">{children}</div>
    </section>
  );
}

function JobCard({ job, companyName = "N/A" }) {
  return (
    <div className="bg-white p-4 rounded shadow border-2 border-neon">
      <img
        src={job.image_url}
        alt={job.title}
        className="h-32 w-full object-cover rounded mb-2"
      />
      <h3 className="font-bold">{job.title}</h3>
      <p className="text-sm">{job.description}</p>
      <p className="text-xs">
        <span className="font-bold">Company: </span>
        {companyName}
      </p>
      <p className="text-xs">
        <span className="font-bold">Location:</span> {job.location}
      </p>
      <p className="text-xs">
        <span className="font-bold">Salary:</span> {job.salary}
      </p>
      <p className="text-xs font-semibold text-black">
        <span className="font-bold">Status:</span>{" "}
        <span
          className={`${
            job.status === "Approved"
              ? "text-green-500"
              : job.status === "Rejected"
              ? "text-red-500"
              : "text-blue-500"
          }`}
        >
          {job.status}
        </span>
      </p>
    </div>
  );
}
