import { useEffect, useState } from "react";
import supabase from "../../supabaseClient";

export default function ManageEmployers() {
  const [employers, setEmployers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [confirmDelete, setConfirmDelete] = useState(null);

  useEffect(() => {
    fetchEmployers();
  }, []);

  const fetchEmployers = async () => {
    const { data, error } = await supabase
      .from("employer_profiles")
      .select("*");
    if (error) {
      console.error("Error fetching employers:", error);
    } else {
      setEmployers(data);
    }
  };

  const handleDelete = async (id) => {
    const { error } = await supabase
      .from("employer_profiles")
      .delete()
      .eq("id", id);
    if (error) {
      console.error("Error deleting employer:", error);
      alert("Failed to delete employer.");
    } else {
      alert("Employer deleted successfully.");
      fetchEmployers();
      setConfirmDelete(null);
    }
  };

  const filteredEmployers = employers.filter((emp) =>
    emp.company_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-6 bg-[#FFFAEC] min-h-screen">
      <div className="flex justify-center mt-4 mb-6">
        <h1 className="text-2xl font-semibold text-[#333333] border-2 border-[#FFD24C] rounded-full px-5 py-1 shadow-[0_0_10px_#FFD24C]">
          Manage Employers
        </h1>
      </div>

      {/* Search bar */}
      <div className="flex justify-center mb-8">
        <input
          type="text"
          placeholder="Search company by name..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-[600px] text-lg p-3 border-2 border-[#FFD24C] rounded-full shadow focus:outline-none focus:ring-2 focus:ring-[#FFD24C] neon-input"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredEmployers.map((emp) => (
          <div
            key={emp.id}
            className="bg-white p-4 rounded shadow-xl hover:shadow-2xl transition flex flex-col items-center text-center space-y-2 border border-[#FFD24C]"
          >
            {emp.logo_url && (
              <img
                src={emp.logo_url}
                alt={`${emp.company_name} Logo`}
                className="w-24 h-24 object-cover rounded-full border shadow"
              />
            )}
            <h2 className="text-lg font-bold">{emp.company_name}</h2>
            <p className="text-sm text-[#555555]">{emp.email}</p>
            <p className="text-sm text-[#555555]">{emp.website}</p>
            <p className="text-[#555555] text-sm">{emp.description}</p>

            <button
              onClick={() => setConfirmDelete(emp.id)}
              className="mt-2 bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 text-sm"
            >
              Delete
            </button>
          </div>
        ))}
      </div>

      {confirmDelete && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded shadow-xl text-center">
            <h3 className="text-xl font-bold mb-4">Are you sure?</h3>
            <p className="mb-4">
              You are about to delete this employer profile.
            </p>
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
