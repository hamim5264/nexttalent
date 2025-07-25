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
    <div className="w-full sm:w-64 h-auto sm:h-full bg-gradient-to-b from-yellow-300 via-white to-yellow-200 text-black flex flex-col shadow-xl">
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
        <h2 className="mt-2 text-base sm:text-lg tracking-widest font-bold text-center">
          {employer?.company_name || "Update"}
        </h2>
      </div>

      <nav className="flex-1 p-4 space-y-2 overflow-y-auto text-sm sm:text-base">
        {[
          { path: "/employer", label: "Dashboard" },
          { path: "/employer/post-job", label: "Post New Job" },
          { path: "/employer/posted-jobs", label: "Posted Jobs" },
          { path: "/employer/all-jobs", label: "All Jobs" },

          { path: "/employer/manage-jobs", label: "Manage Jobs" },
          {
            path: "/employer/interview-schedules",
            label: "Interview Schedules",
          },
          { path: "/employer/applicants", label: "Applicants" },
          { path: "/employer/rejected-feedback", label: "Rejected Feedback" },

          { path: "/employer/profile-settings", label: "Profile Settings" },
          { path: "/employer/review", label: "Review" },
          { path: "/employer/about-us", label: "About Us" },
          { path: "/employer/support-privacy", label: "Support & Privacy" },
        ].map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className="block px-4 py-2 rounded hover:bg-white hover:shadow text-center sm:text-left"
          >
            {item.label}
          </Link>
        ))}
      </nav>
    </div>
  );
}
