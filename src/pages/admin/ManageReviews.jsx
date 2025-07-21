import { useEffect, useState } from "react";
import supabase from "../../supabaseClient";

export default function ManageReviews() {
  const [reviews, setReviews] = useState([]);
  const [confirmDelete, setConfirmDelete] = useState(null);

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    const { data, error } = await supabase.from("user_reviews").select("*");

    if (error) {
      console.error("Error fetching reviews:", error);
    } else {
      setReviews(data);
    }
  };

  const handleDelete = async (id) => {
    const { error } = await supabase.from("user_reviews").delete().eq("id", id);

    if (error) {
      console.error("Error deleting review:", error);
      alert("Failed to delete review.");
    } else {
      alert("Review deleted successfully.");
      fetchReviews();
      setConfirmDelete(null);
    }
  };

  return (
    <div className="p-6 bg-[#FFFAEC] min-h-screen">
      <div className="flex justify-center mt-4 mb-6">
        <h1 className="text-2xl font-semibold text-[#333333] border-2 border-[#FFD24C] rounded-full px-5 py-1 shadow-[0_0_10px_#FFD24C]">
          Manage Reviews
        </h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {reviews.map((review) => (
          <div
            key={review.id}
            className="bg-white p-4 rounded border-2 border-[#FFD24C] shadow hover:shadow-lg space-y-2"
          >
            <p className="text-[#333333]">
              <strong>Role:</strong> {review.role}
            </p>
            <p className="text-[#333333]">{review.review_text}</p>

            <div className="flex justify-between items-center text-sm text-[#555555] mt-2">
              <div>
                ⭐ Rating: {review.rating}/5 <br />
                {new Date(review.created_at).toLocaleString()}
              </div>
              <button
                onClick={() => setConfirmDelete(review.id)}
                className="bg-red-400 text-white px-3 py-1 rounded hover:bg-red-500 text-sm"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {confirmDelete && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded shadow text-center space-y-4">
            <h2 className="text-lg font-bold text-[#333333]">
              Are you sure you want to delete this review?
            </h2>
            <div className="flex justify-center space-x-4">
              <button
                onClick={() => handleDelete(confirmDelete)}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
              >
                Yes, Delete
              </button>
              <button
                onClick={() => setConfirmDelete(null)}
                className="bg-gray-300 text-[#333333] px-4 py-2 rounded hover:bg-gray-400"
              >
                No
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
