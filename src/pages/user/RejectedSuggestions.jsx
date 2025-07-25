import { useEffect, useState } from "react";
import supabase from "../../supabaseClient";
import { getAuth } from "firebase/auth";

export default function RejectedSuggestions() {
  const auth = getAuth();
  const user = auth.currentUser;
  const [suggestions, setSuggestions] = useState([]);

  useEffect(() => {
    if (user) fetchSuggestions();
  }, [user]);

  const fetchSuggestions = async () => {
    const { data, error } = await supabase
      .from("rejected_suggestions")
      .select("*")
      .eq("user_uid", user.uid);

    if (error) {
      console.error("Error fetching suggestions:", error);
    } else {
      setSuggestions(data);
    }
  };

  return (
    <div className="p-6 bg-[#FFFAEC] min-h-screen">
      <div className="flex justify-center mt-4 mb-6">
        <h1 className="text-2xl font-semibold text-[#333333] border-2 border-neon rounded-full px-5 py-1 shadow-[0_0_10px_#FFD24C]">
          Rejected Suggestions
        </h1>
      </div>

      {suggestions.length === 0 ? (
        <p className="text-center text-[#555555]">No suggestions found yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {suggestions.map((sug) => (
            <div
              key={sug.id}
              className="bg-white p-4 rounded shadow border-2 border-neon space-y-2"
            >
              <h3 className="font-bold text-lg">{sug.job_title}</h3>
              <p className="text-sm text-[#555555]">
                Company: <strong>{sug.company_name}</strong>
              </p>

              {sug.questions_answers &&
              typeof sug.questions_answers === "object" ? (
                Object.entries(sug.questions_answers).map(
                  ([question, answer], idx) => (
                    <p key={idx} className="text-sm">
                      <strong>{question}</strong>: {answer}
                    </p>
                  )
                )
              ) : (
                <p className="text-sm text-gray-500">
                  No suggestions provided.
                </p>
              )}

              <p className="text-sm text-[#555555]">
                💡 Comment: {sug.comment ? sug.comment : "N/A"}
              </p>

              <p className="text-sm text-[#555555]">
                📹 Video Link:{" "}
                {sug.video_link ? (
                  <a
                    href={sug.video_link}
                    target="_blank"
                    rel="noreferrer"
                    className="text-blue-500 underline"
                  >
                    Go to Link
                  </a>
                ) : (
                  "N/A"
                )}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
