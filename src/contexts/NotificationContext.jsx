import { createContext, useContext, useState, useEffect } from "react";
import supabase from "../supabaseClient";
import { getAuth } from "firebase/auth";

const NotificationContext = createContext();

export function NotificationProvider({ children }) {
  const [unreadCount, setUnreadCount] = useState(0);
  const auth = getAuth();

  useEffect(() => {
    const interval = setInterval(fetchUnreadNotifications, 10000);
    document.addEventListener("visibilitychange", handleTabFocus);
    fetchUnreadNotifications();

    return () => {
      clearInterval(interval);
      document.removeEventListener("visibilitychange", handleTabFocus);
    };
  }, []);

  const handleTabFocus = () => {
    if (document.visibilityState === "visible") {
      fetchUnreadNotifications();
    }
  };

  const fetchUnreadNotifications = async () => {
    const user = auth.currentUser;
    if (!user) return;

    const role = sessionStorage.getItem("role");
    if (!role) return;

    let query = supabase
      .from("notifications")
      .select("id")
      .eq("is_read", false);

    if (role === "admin") {
      query = query.eq("role", "admin");
    } else {
      query = query.eq("recipient_uid", user.uid).eq("role", role);
    }

    const { data, error } = await query;
    if (error) {
      console.error("Error fetching unread notifications:", error);
    } else {
      setUnreadCount(data.length);
    }
  };

  return (
    <NotificationContext.Provider
      value={{
        unreadCount,
        fetchUnreadNotifications,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotification() {
  return useContext(NotificationContext);
}
