import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect, useState } from "react";
import supabase from "./supabaseClient";

// Context
import { NotificationProvider } from "./contexts/NotificationContext";

// Common
import SplashScreen from "./pages/SplashScreen";
import LandingPage from "./pages/LandingPage";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import MaintenanceMode from "./pages/MaintenanceMode";
import AboutUs from "./pages/AboutUs";
import SupportPrivacy from "./pages/SupportPrivacy";
import ReviewScreen from "./pages/ReviewScreen";
import NotificationsScreen from "./pages/NotificationsScreen";

// Admin
import AdminDashboard from "./pages/admin/AdminDashboard";
import ManageJobs from "./pages/admin/ManageJobs";
import ManageEmployers from "./pages/admin/ManageEmployers";
import ManageUsers from "./pages/admin/ManageUsers";
import ManageNewsFeed from "./pages/admin/ManageNewsFeed";
import AdminReports from "./pages/admin/AdminReports";
import AdminSettings from "./pages/admin/AdminSettings";
import ManageReviews from "./pages/admin/ManageReviews";

// Employer
import EmployerDashboard from "./pages/employer/EmployerDashboard";
import PostJob from "./pages/employer/PostJob";
import EmployerManageJobs from "./pages/employer/ManageJobs";
import Applicants from "./pages/employer/Applicants";
import ProfileSettings from "./pages/employer/ProfileSettings";
import PostedJobsScreen from "./pages/employer/PostedJobsScreen";
import InterviewSchedulesScreen from "./pages/employer/InterviewSchedulesScreen";

// User
import UserDashboard from "./pages/user/UserDashboard";
import BuildResume from "./pages/user/BuildResume";
import SearchJobs from "./pages/user/SearchJobs";
import SavedJobs from "./pages/user/SavedJobs";
import Applications from "./pages/user/Applications";
import UserSettings from "./pages/user/UserSettings";
import YourResume from "./pages/user/YourResume";
import InterviewSchedules from "./pages/user/InterviewSchedules";

export default function App() {
  const [isMaintenance, setIsMaintenance] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSettings = async () => {
      const { data, error } = await supabase
        .from("settings")
        .select("maintenance_mode")
        .eq("id", 1)
        .single();

      if (error) {
        console.error("Error fetching maintenance mode:", error);
      } else {
        setIsMaintenance(data?.maintenance_mode);
      }
      setLoading(false);
    };

    fetchSettings();
  }, []);

  if (loading) {
    return (
      <p className="text-center mt-10 text-[#555555]">
        Checking system status...
      </p>
    );
  }

  if (isMaintenance) {
    return <MaintenanceMode />;
  }

  return (
    <NotificationProvider>
      <BrowserRouter>
        <Routes>
          {/* Public */}
          <Route path="/" element={<SplashScreen />} />
          <Route path="/landing" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/notifications" element={<NotificationsScreen />} />

          {/* Admin */}
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/manage-jobs" element={<ManageJobs />} />
          <Route path="/admin/manage-employers" element={<ManageEmployers />} />
          <Route path="/admin/manage-users" element={<ManageUsers />} />
          <Route path="/admin/manage-newsfeed" element={<ManageNewsFeed />} />
          <Route path="/admin/reports" element={<AdminReports />} />
          <Route path="/admin/settings" element={<AdminSettings />} />
          <Route path="/admin/manage-reviews" element={<ManageReviews />} />

          {/* Employer */}
          <Route path="/employer" element={<EmployerDashboard />} />
          <Route path="/employer/post-job" element={<PostJob />} />
          <Route
            path="/employer/manage-jobs"
            element={<EmployerManageJobs />}
          />
          <Route path="/employer/applicants" element={<Applicants />} />
          <Route path="/employer/posted-jobs" element={<PostedJobsScreen />} />
          <Route path="/employer/about-us" element={<AboutUs />} />
          <Route
            path="/employer/support-privacy"
            element={<SupportPrivacy />}
          />
          <Route path="/employer/review" element={<ReviewScreen />} />
          <Route
            path="/employer/interview-schedules"
            element={<InterviewSchedulesScreen />}
          />
          <Route
            path="/employer/profile-settings"
            element={<ProfileSettings />}
          />

          {/* User */}
          <Route path="/user" element={<UserDashboard />} />
          <Route path="/user/build-resume" element={<BuildResume />} />
          <Route path="/user/search-jobs" element={<SearchJobs />} />
          <Route path="/user/saved-jobs" element={<SavedJobs />} />
          <Route
            path="/user/interview-schedules"
            element={<InterviewSchedules />}
          />
          <Route path="/user/applications" element={<Applications />} />
          <Route path="/user/settings" element={<UserSettings />} />
          <Route path="/user/your-resume" element={<YourResume />} />
          <Route path="/user/about-us" element={<AboutUs />} />
          <Route path="/user/support-privacy" element={<SupportPrivacy />} />
          <Route path="/user/review" element={<ReviewScreen />} />

          {/* Fallback */}
          <Route path="*" element={<LandingPage />} />
        </Routes>
      </BrowserRouter>
    </NotificationProvider>
  );
}
