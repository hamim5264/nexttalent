import { useEffect, useState } from "react";
import supabase from "../supabaseClient";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useNotification } from "../contexts/NotificationContext";

export default function NotificationsScreen() {
  const auth = getAuth();
  const { fetchUnreadNotifications } = useNotification();

  const [user, setUser] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);
        fetchNotifications(firebaseUser);
      } else {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const fetchNotifications = async (currentUser) => {
    const role = sessionStorage.getItem("role");
    if (!role) return;

    try {
      let query = supabase
        .from("notifications")
        .select("*")
        .order("created_at", { ascending: false });

      if (role === "admin") {
        query = query.eq("role", "admin");
      } else {
        query = query.eq("recipient_uid", currentUser.uid).eq("role", role);
      }

      const { data: fetched, error } = await query;

      if (error) {
        console.error("Failed to fetch notifications", error);
      } else {
        setNotifications(fetched || []);
        fetchUnreadNotifications();
      }
    } catch (error) {
      console.error("Unexpected error fetching notifications", error);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (notifId) => {
    const { error } = await supabase
      .from("notifications")
      .update({ is_read: true })
      .eq("id", notifId);

    if (!error && user) {
      await fetchNotifications(user);
    }
  };

  const deleteNotification = async (notifId) => {
    if (!window.confirm("Are you sure you want to delete this notification?"))
      return;

    const { error } = await supabase
      .from("notifications")
      .delete()
      .eq("id", notifId);

    if (!error && user) {
      await fetchNotifications(user);
    }
  };

  if (loading) {
    return <p className="text-center mt-6">Loading notifications...</p>;
  }

  return (
    <div className="p-6 bg-[#FFFAEC] min-h-screen">
      <h1 className="text-2xl font-semibold mb-4 text-center">Notifications</h1>

      {notifications.length === 0 ? (
        <p className="text-center text-gray-600">No notifications yet.</p>
      ) : (
        <div className="space-y-4 max-w-2xl mx-auto">
          {notifications.map((notif) => (
            <div
              key={notif.id}
              className={`bg-white p-4 rounded shadow ${
                notif.is_read ? "opacity-60" : ""
              }`}
            >
              <h2 className="text-lg font-semibold">{notif.title}</h2>
              <p className="text-gray-700">{notif.message}</p>
              <div className="mt-3 flex space-x-3">
                {!notif.is_read && (
                  <button
                    onClick={() => markAsRead(notif.id)}
                    className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 text-sm"
                  >
                    Mark as Read
                  </button>
                )}
                <button
                  onClick={() => deleteNotification(notif.id)}
                  className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 text-sm"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
