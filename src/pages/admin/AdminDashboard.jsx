import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import supabase from "../../supabaseClient";
import Sidebar from "../../components/admin/Sidebar";
import Header from "../../components/admin/Header";
import SummaryCard from "../../components/admin/SummaryCard";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [counts, setCounts] = useState({
    jobs: 0,
    employers: 0,
    jobSeekers: 0,
    pendingApprovals: 0,
  });
  const [trendingJobs, setTrendingJobs] = useState([]);
  const [allJobs, setAllJobs] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [latestNews, setLatestNews] = useState([]);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setLoading(true);
    await Promise.all([
      fetchCounts(),
      fetchTrendingJobs(),
      fetchAllJobs(),
      fetchReviews(),
      fetchLatestNews(),
    ]);
    setLoading(false);
  };

  const fetchCounts = async () => {
    const jobsCount = await supabase
      .from("employer_jobs")
      .select("*", { count: "exact", head: true });
    const employersCount = await supabase
      .from("employer_profiles")
      .select("*", { count: "exact", head: true });
    const seekersCount = await supabase
      .from("user_profiles")
      .select("*", { count: "exact", head: true });
    const pending = await supabase
      .from("employer_jobs")
      .select("*", { count: "exact", head: true })
      .eq("status", "Pending");

    setCounts({
      jobs: jobsCount.count || 0,
      employers: employersCount.count || 0,
      jobSeekers: seekersCount.count || 0,
      pendingApprovals: pending.count || 0,
    });
  };

  const fetchTrendingJobs = async () => {
    const { data: appliedJobs } = await supabase
      .from("user_applied_jobs")
      .select("job_id");

    if (appliedJobs) {
      const jobFrequency = appliedJobs.reduce((acc, curr) => {
        acc[curr.job_id] = (acc[curr.job_id] || 0) + 1;
        return acc;
      }, {});

      const trendingJobIds = Object.keys(jobFrequency).filter(
        (jobId) => jobFrequency[jobId] >= 2
      );

      if (trendingJobIds.length) {
        const { data: jobs } = await supabase
          .from("employer_jobs")
          .select("*")
          .in("id", trendingJobIds);

        setTrendingJobs(jobs || []);
      }
    }
  };

  const fetchAllJobs = async () => {
    const { data: jobsData, error } = await supabase
      .from("employer_jobs")
      .select("*");

    if (error) {
      console.error("Error fetching jobs:", error);
      return;
    }

    const jobsWithCompany = await Promise.all(
      jobsData.map(async (job) => {
        const { data: employer } = await supabase
          .from("employer_profiles")
          .select("company_name")
          .eq("firebase_uid", job.firebase_uid)
          .single();

        return {
          ...job,
          company_name: employer?.company_name || "Unknown",
        };
      })
    );

    setAllJobs(jobsWithCompany);
  };

  const fetchReviews = async () => {
    const { data } = await supabase.from("user_reviews").select("*");
    setReviews(data || []);
  };

  const fetchLatestNews = async () => {
    try {
      const res = await fetch(
        "https://api.rss2json.com/v1/api.json?rss_url=https://feeds.bbci.co.uk/news/technology/rss.xml"
      );
      const data = await res.json();
      setLatestNews(data.items.slice(0, 6));
    } catch (err) {
      console.error("Failed to fetch news", err);
    }
  };

  const chartData = [
    { name: "Jobs", value: counts.jobs, color: "#FFD24C" },
    { name: "Employers", value: counts.employers, color: "#71C9CE" },
    { name: "Job Seekers", value: counts.jobSeekers, color: "#FF6F61" },
    { name: "Pending", value: counts.pendingApprovals, color: "#6A5ACD" },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-yellow-300 via-white to-yellow-200 bg-opacity-60 backdrop-blur-sm">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-yellow-400"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />

        <main className="p-4 sm:p-6 bg-[#FFFAEC] flex-1 overflow-auto">
          <h1 className="text-2xl md:text-3xl font-bold text-center mb-6 bg-gradient-to-r from-yellow-500 via-orange-500 to-pink-500 bg-clip-text text-transparent animate-pulse">
            Empower Your Platform, Admin!
          </h1>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <SummaryCard
              title="Total Jobs"
              value={counts.jobs}
              color="#FFD24C"
            />
            <SummaryCard
              title="Employers"
              value={counts.employers}
              color="#71C9CE"
            />
            <SummaryCard
              title="Job Seekers"
              value={counts.jobSeekers}
              color="#FF6F61"
            />
            <SummaryCard
              title="Pending Approvals"
              value={counts.pendingApprovals}
              color="#6A5ACD"
            />
          </div>

          <section className="bg-white p-4 rounded shadow border-2 border-[#FFD24C] mb-8">
            <h2 className="text-xl font-bold mb-4">Platform Overview</h2>
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

          <section className="mb-8">
            <h2 className="text-xl font-bold mb-3">Trending Jobs</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {trendingJobs.map((job) => (
                <div
                  key={job.id}
                  className="bg-white p-4 rounded shadow border-2 border-neon"
                >
                  <img
                    src={job.image_url || "https://via.placeholder.com/300"}
                    alt={job.title}
                    className="w-full h-40 object-cover rounded mb-2"
                  />
                  <h3 className="text-lg font-bold">{job.title}</h3>
                  <p className="text-[#555555]">
                    Status:{" "}
                    <span
                      className={`font-medium ${
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
              ))}
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-bold mb-3">All Jobs</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {allJobs.map((job) => (
                <div
                  key={job.id}
                  className="bg-white p-4 rounded shadow border-2 border-neon"
                >
                  <img
                    src={job.image_url || "https://via.placeholder.com/300"}
                    alt={job.title}
                    className="w-full h-40 sm:h-48 object-cover rounded mb-2"
                  />
                  <h3 className="text-lg font-bold">{job.title}</h3>
                  <p>Company: {job.company_name}</p>
                  <p className="text-[#555555]">
                    Status:{" "}
                    <span
                      className={`font-medium ${
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
              ))}
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-bold mb-3">Latest Job News</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {latestNews.map((news, index) => (
                <div key={index} className="bg-white p-4 rounded shadow border">
                  <h3 className="font-semibold mb-1">{news.title}</h3>
                  <a
                    href={news.link}
                    target="_blank"
                    rel="noreferrer"
                    className="text-blue-500 underline"
                  >
                    Read More
                  </a>
                </div>
              ))}
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-bold mb-3">User Reviews</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {reviews.map((rev) => (
                <div
                  key={rev.id}
                  className="bg-white p-4 rounded shadow border min-w-[200px]"
                >
                  <p>⭐ {rev.rating} / 5</p>
                  <p className="text-[#555555]">{rev.review_text}</p>
                </div>
              ))}
            </div>
          </section>

          <footer className="mt-8 text-center text-[#555555]">
            &copy; 2025 NextTalent || Powered By DevEngine - All rights
            reserved.
          </footer>
        </main>
      </div>
    </div>
  );
}
