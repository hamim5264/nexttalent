import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import supabase from "../../supabaseClient";
import { getAuth } from "firebase/auth";

export default function UserSidebar() {
  const auth = getAuth();
  const user = auth.currentUser;
  const navigate = useNavigate();

  const [profile, setProfile] = useState(null);

  useEffect(() => {
    if (user) {
      fetchUserProfile();
    }
  }, [user]);

  const fetchUserProfile = async () => {
    const { data, error } = await supabase
      .from("user_profiles")
      .select("name, profile_image_url")
      .eq("firebase_uid", user.uid)
      .single();

    if (!error) {
      setProfile(data);
    }
  };

  const profileImage =
    profile?.profile_image_url ||
    "https://images.unsplash.com/photo-1655650876411-baf437280c44?q=80&w=880&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";

  const profileName = profile?.name || "Update";

  return (
    <div className="w-64 h-full bg-gradient-to-b from-yellow-300 via-white to-yellow-200 text-black flex flex-col shadow-xl">
      <div
        className="flex flex-col items-center justify-center p-6 border-b border-yellow-200 cursor-pointer"
        onClick={() => navigate("/user/settings")}
      >
        <img
          src={profileImage}
          alt="User Profile"
          className="w-20 h-20 rounded-full border-4 border-white shadow-lg mb-2 object-cover"
        />
        <h2 className="text-xl font-bold tracking-widest text-black text-center">
          {profileName}
        </h2>
      </div>

      <nav className="flex-1 p-6 space-y-3">
        <SidebarLink to="/user" label="Dashboard" />
        <SidebarLink to="/user/build-resume" label="Build Resume" />
        <SidebarLink to="/user/your-resume" label="Your Resume" />
        <SidebarLink to="/user/search-jobs" label="Search Jobs" />
        <SidebarLink to="/user/saved-jobs" label="Saved Jobs" />
        <SidebarLink
          to="/user/interview-schedules"
          label="Interview Schedules"
        />
        <SidebarLink to="/user/applications" label="Applications" />
        <SidebarLink to="/user/settings" label="Settings" />
        <SidebarLink to="/user/review" label="Review" />
        <SidebarLink to="/user/about-us" label="About Us" />
        <SidebarLink to="/user/support-privacy" label="Support & Privacy" />
      </nav>
    </div>
  );
}

function SidebarLink({ to, label }) {
  return (
    <Link
      to={to}
      className="block text-sm font-medium tracking-wider py-2 px-3 rounded transition-all duration-300 hover:bg-white hover:shadow-md hover:scale-105"
    >
      {label}
    </Link>
  );
}
