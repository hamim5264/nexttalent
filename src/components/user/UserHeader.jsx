import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAuth, signOut } from "firebase/auth";
import supabase from "../../supabaseClient";
import { Bell, LogOut } from "lucide-react";
import { useNotification } from "../../contexts/NotificationContext";

export default function UserHeader() {
  const navigate = useNavigate();
  const { unreadCount, fetchUnreadNotifications } = useNotification();
  const [user, setUser] = useState(null);
  const [userName, setUserName] = useState("");

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = auth.onAuthStateChanged((firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);
        fetchUserProfile(firebaseUser);
        fetchUnreadNotifications();
      }
    });

    document.addEventListener("visibilitychange", handleTabFocus);
    return () => {
      unsubscribe();
      document.removeEventListener("visibilitychange", handleTabFocus);
    };
  }, []);

  const fetchUserProfile = async (currentUser) => {
    const { data, error } = await supabase
      .from("user_profiles")
      .select("name")
      .eq("firebase_uid", currentUser.uid)
      .single();

    if (data && !error) {
      setUserName(data.name);
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
    <header className="bg-gradient-to-r from-yellow-300 to-yellow-100 p-4 flex justify-between items-center shadow-md">
      <h2
        className="text-lg font-semibold text-[#333333] cursor-pointer"
        onClick={() => {
          if (!userName) navigate("/user/settings");
        }}
      >
        Welcome {userName || <span className="underline">Update</span>} to your
        dashboard
      </h2>

      <div className="flex items-center space-x-6">
        <div
          className="relative cursor-pointer text-[#333333]"
          onClick={handleNotificationClick}
        >
          <Bell className="w-6 h-6 hover:text-[#FFD24C]" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-2 bg-red-500 text-white text-xs rounded-full px-1.5">
              {unreadCount}
            </span>
          )}
        </div>

        <LogOut
          className="w-6 h-6 text-[#333333] cursor-pointer hover:text-red-500"
          onClick={handleLogout}
        />
      </div>
    </header>
  );
}
