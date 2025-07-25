import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAuth, signOut } from "firebase/auth";
import { Bell, LogOut } from "lucide-react";
import supabase from "../../supabaseClient";
import { useNotification } from "../../contexts/NotificationContext";

export default function EmployerHeader() {
  const navigate = useNavigate();
  const { unreadCount, fetchUnreadNotifications } = useNotification();
  const [user, setUser] = useState(null);
  const [employerName, setEmployerName] = useState("");

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = auth.onAuthStateChanged((firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);
        fetchEmployerProfile(firebaseUser);
        fetchUnreadNotifications();
      }
    });

    document.addEventListener("visibilitychange", handleTabFocus);
    return () => {
      unsubscribe();
      document.removeEventListener("visibilitychange", handleTabFocus);
    };
  }, []);

  const fetchEmployerProfile = async (currentUser) => {
    const { data, error } = await supabase
      .from("employer_profiles")
      .select("company_name")
      .eq("firebase_uid", currentUser.uid)
      .single();

    if (!error && data) {
      setEmployerName(data.company_name);
    }
  };

  const handleTabFocus = () => {
    if (document.visibilityState === "visible") {
      fetchUnreadNotifications();
    }
  };

  const handleNotificationClick = () => {
    navigate("/notifications");
  };

  const handleLogout = () => {
    const auth = getAuth();
    signOut(auth).finally(() => {
      sessionStorage.clear();
      localStorage.clear();
      navigate("/landing", { replace: true });
      setTimeout(() => {
        window.location.href = "/landing";
      }, 100);
    });
  };

  return (
    <header className="bg-gradient-to-r from-yellow-300 to-yellow-100 p-3 flex justify-between items-center shadow-md flex-wrap">
      <div className="flex items-center space-x-2">
        <h2
          className="text-sm md:text-lg font-semibold text-[#333333] cursor-pointer"
          onClick={() => {
            if (!employerName) navigate("/employer/profile-settings");
          }}
        >
          Welcome {employerName || <span className="underline">Update</span>} to
          your dashboard
        </h2>
      </div>

      <div className="flex items-center space-x-3 md:space-x-6 mt-2 md:mt-0">
        <div
          className="relative cursor-pointer text-[#333333]"
          onClick={handleNotificationClick}
        >
          <Bell className="w-4 h-4 md:w-6 md:h-6 hover:text-[#FFD24C]" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-2 bg-red-500 text-white text-xs rounded-full px-1.5">
              {unreadCount}
            </span>
          )}
        </div>

        <LogOut
          className="w-4 h-4 md:w-6 md:h-6 text-[#333333] cursor-pointer hover:text-red-500"
          onClick={handleLogout}
        />
      </div>
    </header>
  );
}
