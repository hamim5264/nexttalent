import { Link } from "react-router-dom";
import AdminLogo from "../../assets/admin_logo.png";

export default function Sidebar() {
  return (
    <div className="w-64 h-full bg-gradient-to-b from-yellow-300 via-white to-yellow-200 text-black flex flex-col shadow-xl">
      <div className="flex flex-col items-center p-6 border-b border-yellow-200">
        <img
          src={AdminLogo}
          alt="Admin Logo"
          className="w-20 h-20 rounded-full border-4 border-white shadow-lg mb-2"
        />
        <h2 className="text-xl font-bold tracking-widest text-black">
          NextTalent
        </h2>
      </div>

      <nav className="flex-1 p-6 space-y-3">
        <SidebarLink to="/admin" label="Dashboard" />
        <SidebarLink to="/admin/manage-jobs" label="Manage Jobs" />
        <SidebarLink to="/admin/manage-employers" label="Manage Employers" />
        <SidebarLink to="/admin/manage-users" label="Manage Users" />
        <SidebarLink to="/admin/manage-reviews" label="Manage Reviews" />
        <SidebarLink to="/admin/manage-newsfeed" label="News Feed" />
        <SidebarLink to="/admin/reports" label="Reports & Statistics" />
        <SidebarLink to="/admin/settings" label="Settings" />
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
