import { useState, useEffect } from "react";
import supabase from "../../supabaseClient";
import {
  notifySpecificUser,
  notifyRole,
  notifyAllUsers,
} from "../../services/notificationService";

export default function ManageJobs() {
  const [jobs, setJobs] = useState([]);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [rejectReasons, setRejectReasons] = useState([]);
  const [rejectComment, setRejectComment] = useState("");
  const [selectedJob, setSelectedJob] = useState(null);

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const { data: jobsData, error } = await supabase
        .from("employer_jobs")
        .select("*");

      if (error) {
        console.error("Error fetching jobs:", error);
        return;
      }

      const { data: employers, error: empError } = await supabase
        .from("employer_profiles")
        .select("*");

      if (empError) {
        console.error("Error fetching employer profiles:", empError);
        return;
      }

      const jobsWithEmployer = jobsData.map((job) => {
        const employer = employers.find(
          (e) => e.firebase_uid === job.firebase_uid
        );
        return {
          ...job,
          employer,
        };
      });

      setJobs(jobsWithEmployer);
    } catch (err) {
      console.error("Unexpected error:", err);
    }
  };

  const updateJobStatus = async (id, newStatus) => {
    const { data: jobData, error: fetchError } = await supabase
      .from("employer_jobs")
      .select("*")
      .eq("id", id)
      .single();

    if (fetchError || !jobData) {
      console.error("Error fetching job for status update:", fetchError);
      return;
    }

    const { error } = await supabase
      .from("employer_jobs")
      .update({ status: newStatus })
      .eq("id", id);

    if (!error) {
      await notifySpecificUser(
        jobData.firebase_uid,
        "employer",
        `Job "${jobData.title}" ${newStatus}`,
        `Admin has ${newStatus.toLowerCase()} your job titled "${
          jobData.title
        }".`
      );

      fetchJobs();
    } else {
      console.error("Error updating job status:", error);
    }
  };

  const confirmDeleteJob = async (id) => {
    const { data: jobData, error: fetchError } = await supabase
      .from("employer_jobs")
      .select("*")
      .eq("id", id)
      .single();

    if (fetchError || !jobData) {
      console.error("Error fetching job for delete:", fetchError);
      return;
    }

    const { error } = await supabase
      .from("employer_jobs")
      .delete()
      .eq("id", id);

    if (!error) {
      await notifySpecificUser(
        jobData.firebase_uid,
        "employer",
        `Job "${jobData.title}" Deleted`,
        `Admin has deleted your job titled "${jobData.title}".`
      );

      fetchJobs();
      setConfirmDelete(null);
    } else {
      console.error("Error deleting job:", error);
    }
  };

  return (
    <div className="p-6 bg-[#FFFAEC] min-h-screen">
      <div className="flex justify-center mt-4 mb-6">
        <h1 className="text-2xl font-semibold text-[#333333] border-2 border-[#FFD24C] rounded-full px-5 py-1 shadow-[0_0_10px_#FFD24C]">
          Manage Jobs
        </h1>
      </div>

      {jobs.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {jobs.map((job) => (
            <div
              key={job.id}
              className="bg-white p-4 rounded shadow border-l-4 border-[#FFD24C] hover:shadow-md transition"
            >
              {job.image_url && (
                <img
                  src={job.image_url}
                  alt={job.title}
                  className="w-full h-40 object-cover rounded mb-3"
                />
              )}

              <h2 className="text-xl font-semibold text-[#333333] mb-2">
                {job.title}
              </h2>
              <p className="text-[#555555] mb-1">
                <strong>Location:</strong> {job.location}
              </p>
              <p className="text-[#555555] mb-1">
                <strong>Salary:</strong> {job.salary}
              </p>
              <p className="text-[#555555] mb-1">
                <strong>Status:</strong>{" "}
                <span
                  className={`font-medium ${
                    job.status === "Approved"
                      ? "text-green-500"
                      : job.status === "Rejected"
                      ? "text-red-500"
                      : "text-blue-500"
                  }`}
                >
                  {job.status}
                </span>
              </p>

              <p className="text-[#555555] mb-1">
                <strong>Description:</strong> {job.description}
              </p>
              <p className="text-[#555555] mb-1">
                <span className="font-bold">Skills:</span>{" "}
                {job.required_skills?.length === 1 &&
                job.required_skills[0] === "no skills provided from company" ? (
                  <span className="text-red-500 uppercase">
                    {job.required_skills[0]}
                  </span>
                ) : (
                  job.required_skills?.join(", ")
                )}
              </p>

              <p className="text-[#555555] mb-1">
                <span className="font-bold">Deadline:</span>{" "}
                {job.application_deadline ? (
                  job.application_deadline
                ) : (
                  <span className="text-red-500 font-semibold">
                    NOT PROVIDED
                  </span>
                )}
              </p>

              {job.employer && (
                <div className="mt-3 bg-gray-50 p-3 rounded">
                  <p className="text-sm text-[#333333] font-semibold">
                    Employer Info:
                  </p>
                  <p>
                    <strong>Company:</strong> {job.employer.company_name}
                  </p>
                  <p>
                    <strong>Email:</strong> {job.employer.email}
                  </p>
                  <p>
                    <strong>Website:</strong> {job.employer.website || "N/A"}
                  </p>
                </div>
              )}

              <div className="flex space-x-2 mt-4">
                <button
                  className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 text-sm"
                  onClick={() => updateJobStatus(job.id, "Approved")}
                >
                  Approve
                </button>
                <button
                  className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600 text-sm"
                  onClick={() => updateJobStatus(job.id, "Pending")}
                >
                  Pending
                </button>

                <button
                  className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 text-sm"
                  onClick={() => {
                    setSelectedJob(job);
                    setShowRejectDialog(true);
                  }}
                >
                  Reject
                </button>

                <button
                  className="bg-gray-500 text-white px-3 py-1 rounded hover:bg-gray-600 text-sm"
                  onClick={() => setConfirmDelete(job.id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-[#555555] text-lg mt-4">
          No jobs posted yet by employers.
        </p>
      )}

      {confirmDelete && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded shadow-xl text-center">
            <h3 className="text-xl font-bold mb-4">Are you sure?</h3>
            <p className="mb-4">You are about to delete this job posting.</p>
            <div className="space-x-4">
              <button
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                onClick={() => confirmDeleteJob(confirmDelete)}
              >
                Yes, Delete
              </button>
              <button
                className="bg-gray-300 text-[#333333] px-4 py-2 rounded hover:bg-gray-400"
                onClick={() => setConfirmDelete(null)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {showRejectDialog && selectedJob && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <div className="bg-white w-[90%] md:w-[500px] p-6 rounded shadow-xl space-y-4">
            <h2 className="text-xl font-semibold text-center mb-2 text-[#333]">
              Give Feedback to Employer
            </h2>

            <p className="text-[#333] font-medium">
              Why are you rejecting this job?
            </p>
            <div className="space-y-2">
              {[
                "Incomplete job details",
                "Invalid salary range",
                "Missing image or branding",
                "Poor grammar or tone",
                "Others",
              ].map((reason) => (
                <label
                  key={reason}
                  className="flex items-center space-x-2 text-[#555]"
                >
                  <input
                    type="checkbox"
                    value={reason}
                    checked={rejectReasons.includes(reason)}
                    onChange={(e) => {
                      const updated = e.target.checked
                        ? [...rejectReasons, reason]
                        : rejectReasons.filter((r) => r !== reason);
                      setRejectReasons(updated);
                    }}
                  />
                  <span>{reason}</span>
                </label>
              ))}
            </div>

            <textarea
              placeholder="Write a comment (optional)"
              value={rejectComment}
              onChange={(e) => setRejectComment(e.target.value)}
              className="w-full border border-gray-300 p-2 rounded"
              rows={3}
            ></textarea>

            <div className="flex justify-between pt-4">
              <button
                onClick={() => setShowRejectDialog(false)}
                className="bg-gray-300 text-[#333] px-4 py-2 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={async () => {
                  if (rejectReasons.length === 0) {
                    alert("Please select at least one reason.");
                    return;
                  }

                  const { error: insertError } = await supabase
                    .from("job_rejection_feedback")
                    .insert([
                      {
                        job_id: selectedJob.id,
                        employer_uid: selectedJob.firebase_uid,
                        selected_reasons: rejectReasons,
                        comment: rejectComment || null,
                      },
                    ]);

                  if (!insertError) {
                    await supabase
                      .from("employer_jobs")
                      .update({ status: "Rejected" })
                      .eq("id", selectedJob.id);

                    await notifySpecificUser(
                      selectedJob.firebase_uid,
                      "employer",
                      `Job "${selectedJob.title}" Rejected`,
                      `Admin has rejected your job titled "${selectedJob.title}" and provided feedback.`
                    );

                    fetchJobs();
                    setShowRejectDialog(false);
                    setRejectReasons([]);
                    setRejectComment("");
                    setSelectedJob(null);
                  } else {
                    console.error("Error saving feedback:", insertError);
                    alert("Failed to reject job. Try again.");
                  }
                }}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
              >
                Submit & Reject
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
