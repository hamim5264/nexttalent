import { useEffect, useState } from "react";
import supabase from "../../supabaseClient";
import { getAuth } from "firebase/auth";

export default function RejectedFeedbackScreen() {
  const auth = getAuth();
  const user = auth.currentUser;
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) fetchFeedbacks();
  }, [user]);

  const fetchFeedbacks = async () => {
    const { data, error } = await supabase
      .from("job_rejection_feedback")
      .select("*, employer_jobs(title)")
      .eq("employer_uid", user.uid)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching rejection feedback:", error);
    } else {
      setFeedbacks(data);
    }

    setLoading(false);
  };

  return (
    <div className="p-6 bg-[#FFFAEC] min-h-screen">
      <div className="flex justify-center mt-4 mb-6">
        <h1 className="text-2xl font-semibold text-[#333333] border-2 border-[#FFD24C] rounded-full px-6 py-2 shadow-[0_0_12px_#FFD24C]">
          Rejected Feedback
        </h1>
      </div>

      {loading ? (
        <p className="text-center text-[#555555]">Loading feedbacks...</p>
      ) : feedbacks.length === 0 ? (
        <p className="text-center text-[#555555] text-lg">
          You haven't received any rejection feedback yet.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {feedbacks.map((feedback) => (
            <div
              key={feedback.id}
              className="bg-white p-4 rounded shadow border-2 border-[#FFD24C] space-y-3"
            >
              <h3 className="font-bold text-lg text-[#333333]">
                {feedback.employer_jobs?.title || "Job Title Not Found"}
              </h3>

              <p className="text-sm text-gray-600">
                <strong>Rejected On:</strong>{" "}
                {new Date(feedback.created_at).toLocaleDateString()}
              </p>

              <div>
                <p className="font-semibold text-[#333333] mb-1">Reasons:</p>
                <ul className="list-disc list-inside text-[#555555] text-sm">
                  {feedback.selected_reasons.map((reason, index) => (
                    <li key={index}>{reason}</li>
                  ))}
                </ul>
              </div>

              <div>
                <p className="font-semibold text-[#333333] mb-1">Comment:</p>
                <p className="text-sm text-[#555555]">
                  {feedback.comment || "No comment provided"}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
