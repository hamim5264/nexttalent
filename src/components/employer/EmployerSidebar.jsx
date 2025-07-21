import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import supabase from "../../supabaseClient";
import { getAuth } from "firebase/auth";

export default function EmployerSidebar() {
  const [employer, setEmployer] = useState(null);
  const navigate = useNavigate();
  const auth = getAuth();
  const user = auth.currentUser;

  useEffect(() => {
    if (user) {
      fetchEmployerProfile();
    }
  }, [user]);

  const fetchEmployerProfile = async () => {
    const { data, error } = await supabase
      .from("employer_profiles")
      .select("company_name, logo_url")
      .eq("firebase_uid", user.uid)
      .single();

    if (!error) {
      setEmployer(data);
    } else {
      console.error("Error fetching employer profile:", error);
    }
  };

  return (
    <div className="w-64 h-full bg-gradient-to-b from-yellow-300 via-white to-yellow-200 text-black flex flex-col shadow-xl">
      <div
        onClick={() => navigate("/employer/profile-settings")}
        className="flex flex-col items-center p-4 cursor-pointer hover:opacity-80 transition"
      >
        <img
          src={
            employer?.logo_url ||
            "https://images.unsplash.com/photo-1655650876411-baf437280c44?q=80&w=880&auto=format&fit=crop"
          }
          alt="Employer Logo"
          className="w-20 h-20 rounded-full object-cover border-2 border-white shadow"
        />
        <h2 className="mt-2 text-lg tracking-widest font-bold text-center">
          {employer?.company_name || "Update"}
        </h2>
      </div>

      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        <Link
          to="/employer"
          className="block px-4 py-2 rounded hover:bg-white hover:shadow"
        >
          Dashboard
        </Link>
        <Link
          to="/employer/post-job"
          className="block px-4 py-2 rounded hover:bg-white hover:shadow"
        >
          Post New Job
        </Link>
        <Link
          to="/employer/posted-jobs"
          className="block px-4 py-2 rounded hover:bg-white hover:shadow"
        >
          Posted Jobs
        </Link>
        <Link
          to="/employer/manage-jobs"
          className="block px-4 py-2 rounded hover:bg-white hover:shadow"
        >
          Manage Jobs
        </Link>
        <Link
          to="/employer/interview-schedules"
          className="block px-4 py-2 rounded hover:bg-white hover:shadow"
        >
          Interview Schedules
        </Link>
        <Link
          to="/employer/applicants"
          className="block px-4 py-2 rounded hover:bg-white hover:shadow"
        >
          Applicants
        </Link>
        <Link
          to="/employer/profile-settings"
          className="block px-4 py-2 rounded hover:bg-white hover:shadow"
        >
          Profile Settings
        </Link>
        <Link
          to="/employer/review"
          className="block px-4 py-2 rounded hover:bg-white hover:shadow"
        >
          Review
        </Link>
        <Link
          to="/employer/about-us"
          className="block px-4 py-2 rounded hover:bg-white hover:shadow"
        >
          About Us
        </Link>
        <Link
          to="/employer/support-privacy"
          className="block px-4 py-2 rounded hover:bg-white hover:shadow"
        >
          Support & Privacy
        </Link>
      </nav>
    </div>
  );
}
