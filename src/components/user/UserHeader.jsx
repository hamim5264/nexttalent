import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAuth, signOut } from "firebase/auth";
import supabase from "../../supabaseClient";
import { Bell, LogOut, Menu } from "lucide-react";
import { useNotification } from "../../contexts/NotificationContext";

export default function UserHeader({ onMenuClick }) {
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

    return () => unsubscribe();
  }, []);

  const fetchUserProfile = async (currentUser) => {
    const { data } = await supabase
      .from("user_profiles")
      .select("name")
      .eq("firebase_uid", currentUser.uid)
      .single();

    if (data) {
      setUserName(data.name);
    }
  };

  const handleLogout = () => {
    const auth = getAuth();
    signOut(auth).finally(() => {
      sessionStorage.clear();
      localStorage.clear();
      navigate("/landing", { replace: true });
    });
  };

  return (
    <header className="bg-gradient-to-r from-yellow-300 to-yellow-100 p-3 shadow-md">
      <div className="flex justify-between items-center flex-nowrap gap-2">
        <Menu
          className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-[#333333] md:hidden cursor-pointer"
          onClick={onMenuClick}
        />

        <h2
          className="text-[11px] sm:text-sm md:text-base font-medium text-[#333333] truncate max-w-[140px] sm:max-w-[200px] md:max-w-none cursor-pointer"
          onClick={() => {
            if (!userName) navigate("/user/settings");
          }}
        >
          Welcome {userName || <span className="underline">Update</span>} to
          your dashboard
        </h2>

        <div className="flex items-center space-x-2 sm:space-x-3 md:space-x-4 ml-auto">
          <div
            className="relative cursor-pointer text-[#333333]"
            onClick={() => navigate("/notifications")}
          >
            <Bell className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 hover:text-[#FFD24C]" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-2 bg-red-500 text-white text-[9px] sm:text-[10px] rounded-full px-1">
                {unreadCount}
              </span>
            )}
          </div>

          <LogOut
            className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 text-[#333333] cursor-pointer hover:text-red-500"
            onClick={handleLogout}
          />
        </div>
      </div>
    </header>
  );
}
