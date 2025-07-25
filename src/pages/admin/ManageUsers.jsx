import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import supabase from "../../supabaseClient";

export default function ManageUsers() {
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [confirmDelete, setConfirmDelete] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    const { data, error } = await supabase.from("user_profiles").select("*");
    if (error) {
      console.error("Error fetching users:", error);
    } else {
      setUsers(data);
    }
  };

  const handleDelete = async (id) => {
    const { error } = await supabase
      .from("user_profiles")
      .delete()
      .eq("id", id);
    if (error) {
      console.error("Error deleting user:", error);
      alert("Failed to delete user.");
    } else {
      alert("User deleted successfully.");
      fetchUsers();
      setConfirmDelete(null);
    }
  };

  const filteredUsers = users.filter((user) =>
    user.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-6 bg-[#FFFAEC] min-h-screen">
      <div className="flex justify-center mt-4 mb-6">
        <h1 className="text-2xl font-semibold text-[#333333] border-2 border-[#FFD24C] rounded-full px-5 py-1 shadow-[0_0_10px_#FFD24C]">
          Manage Users
        </h1>
      </div>

      <div className="flex justify-center mb-8">
        <input
          type="text"
          placeholder="Search user by name..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-[600px] text-lg p-3 border-2 border-[#FFD24C] rounded-full shadow focus:outline-none focus:ring-2 focus:ring-[#FFD24C]"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredUsers.map((user) => (
          <div
            key={user.id}
            className="bg-white p-4 rounded shadow-xl hover:shadow-2xl transition flex flex-col items-center text-center space-y-2 border border-[#FFD24C]"
          >
            {user.profile_image_url && (
              <img
                src={user.profile_image_url}
                alt="Profile"
                className="w-24 h-24 object-cover rounded-full border shadow"
              />
            )}
            <h2 className="text-lg font-bold">{user.name}</h2>
            <p className="text-sm text-[#555555]">{user.email}</p>
            <p className="text-sm text-[#555555]">{user.phone}</p>

            <div className="mt-2 flex flex-col sm:flex-row sm:justify-start sm:space-x-4 w-full">
              <button
                onClick={() => setConfirmDelete(user.id)}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 text-sm mb-2 sm:mb-0"
              >
                Delete
              </button>
              <button
                onClick={() => navigate(`/resume/${user.firebase_uid}`)}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 text-sm"
              >
                View Resume
              </button>
            </div>
          </div>
        ))}
      </div>

      {confirmDelete && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded shadow-xl text-center">
            <h3 className="text-xl font-bold mb-4">Are you sure?</h3>
            <p className="mb-4">You are about to delete this user profile.</p>
            <div className="space-x-4">
              <button
                onClick={() => handleDelete(confirmDelete)}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
              >
                Yes, Delete
              </button>
              <button
                onClick={() => setConfirmDelete(null)}
                className="bg-gray-300 text-[#333] px-4 py-2 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
