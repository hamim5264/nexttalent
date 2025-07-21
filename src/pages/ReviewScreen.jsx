import { useState } from "react";
import supabase from "../supabaseClient";
import { getAuth } from "firebase/auth";
import { Star } from "lucide-react";

export default function ReviewScreen() {
  const auth = getAuth();
  const user = auth.currentUser;

  const [review, setReview] = useState("");
  const [rating, setRating] = useState(0);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!review.trim() || rating === 0) {
      alert("Please provide both feedback and rating!");
      return;
    }

    try {
      const role = window.location.pathname.includes("/user/")
        ? "user"
        : "employer";

      const { error } = await supabase.from("user_reviews").insert([
        {
          firebase_uid: user.uid,
          role,
          review_text: review,
          rating,
        },
      ]);

      if (error) {
        console.error("Error saving review:", error);
        alert("Failed to submit review.");
      } else {
        alert("Thank you for your feedback!");
        setReview("");
        setRating(0);
      }
    } catch (err) {
      console.error("Unexpected error:", err);
    }
  };

  return (
    <div className="p-6 bg-[#FFFAEC] min-h-screen flex flex-col items-center">
      <div className="flex justify-center mt-4 mb-6">
        <h1 className="text-2xl font-semibold text-[#333333] border-2 border-[#FFD24C] rounded-full px-5 py-1 shadow-[0_0_10px_#FFD24C]">
          Share Your Feedback/Review
        </h1>
      </div>
      <p className="text-[#555555] mb-6">
        We value your feedback. Please share your experience with us.
      </p>

      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded shadow-xl max-w-xl w-full space-y-4 border border-[#FFD24C]"
      >
        <textarea
          placeholder="Give your feedback/review"
          value={review}
          onChange={(e) => setReview(e.target.value)}
          rows="4"
          className="w-full p-2 border border-[#FFD24C] rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-[#FFD24C]"
        />

        <div className="flex items-center space-x-2">
          <span className="text-[#333333] font-medium">Your Rating:</span>
          {[1, 2, 3, 4, 5].map((star) => (
            <Star
              key={star}
              onClick={() => setRating(star)}
              className={`cursor-pointer ${
                star <= rating
                  ? "text-yellow-400 fill-yellow-400"
                  : "text-gray-300"
              }`}
            />
          ))}
        </div>

        <button
          type="submit"
          className="w-full bg-[#FFD24C] text-[#333333] font-semibold px-4 py-2 rounded hover:bg-[#FFE9B5] transition"
        >
          Submit Review
        </button>
      </form>
    </div>
  );
}
