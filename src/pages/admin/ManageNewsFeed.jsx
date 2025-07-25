import { useState, useEffect } from "react";
import supabase from "../../supabaseClient";
import {
  notifySpecificUser,
  notifyRole,
  notifyAllUsers,
} from "../../services/notificationService";

export default function ManageNewsFeed() {
  const [feeds, setFeeds] = useState([]);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [newFeed, setNewFeed] = useState({
    title: "",
    description: "",
    imageUrl: "",
  });
  const [confirmDelete, setConfirmDelete] = useState(null);

  useEffect(() => {
    fetchNewsFeed();
  }, []);

  const fetchNewsFeed = async () => {
    const { data, error } = await supabase
      .from("news_feed")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) console.error("Error fetching news feed:", error);
    else setFeeds(data);
  };

  const handleAddNews = async () => {
    if (newFeed.title && newFeed.description && newFeed.imageUrl) {
      try {
        const { error: newsError } = await supabase.from("news_feed").insert([
          {
            title: newFeed.title,
            description: newFeed.description,
            image_url: newFeed.imageUrl,
          },
        ]);

        if (newsError) {
          console.error("Error adding news:", newsError);
          alert("Failed to add news.");
          return;
        }

        await notifyRole(
          "employer",
          "New News Published",
          `Admin has posted: ${newFeed.title}. Check the latest news section!`
        );
        console.log("Employer notification sent");

        await notifyRole(
          "user",
          "Latest News Update",
          `New announcement: ${newFeed.title}. Stay informed!`
        );
        console.log("User notification sent");

        alert("News added and notifications sent to employers and users!");

        fetchNewsFeed();
        setNewFeed({ title: "", description: "", imageUrl: "" });
        setShowAddDialog(false);
      } catch (err) {
        console.error("Unexpected error adding news:", err);
        alert("An unexpected error occurred while adding the news.");
      }
    } else {
      alert("Please fill all news fields.");
    }
  };

  const confirmDeleteFeed = async (id) => {
    const { error } = await supabase.from("news_feed").delete().eq("id", id);

    if (error) console.error("Error deleting news:", error);
    else fetchNewsFeed();

    setConfirmDelete(null);
  };

  return (
    <div className="p-6 bg-[#FFFAEC] min-h-screen">
      <div className="flex justify-center mt-4 mb-6">
        <h1 className="text-2xl font-semibold text-[#333333] border-2 border-[#FFD24C] rounded-full px-5 py-1 shadow-[0_0_10px_#FFD24C]">
          Manage News Feed
        </h1>
      </div>

      <div className="flex justify-center mb-6">
        <button
          className="border-2 border-[#FFD24C] text-[#FFD24C] px-6 py-2 rounded-full hover:bg-[#FFD24C] hover:text-black shadow-[0_0_10px_#FFD24C] transition-all"
          onClick={() => setShowAddDialog(true)}
        >
          Add News Feed
        </button>
      </div>

      <div className="space-y-4">
        {feeds.map((feed) => (
          <div
            key={feed.id}
            className="bg-white p-4 rounded shadow border-l-4 border-[#FFD24C] hover:shadow-md transition flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
          >
            <div className="flex flex-col sm:flex-row items-center gap-4 w-full">
              <img
                src={feed.image_url}
                alt={feed.title}
                className="w-full sm:w-20 h-32 sm:h-20 object-cover rounded"
              />
              <div className="flex-1">
                <h2 className="text-lg font-semibold text-[#333333]">
                  {feed.title}
                </h2>
                <p className="text-[#555555] text-sm">{feed.description}</p>
              </div>
            </div>

            <button
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition self-end sm:self-auto"
              onClick={() => setConfirmDelete(feed.id)}
            >
              Delete
            </button>
          </div>
        ))}
      </div>

      {confirmDelete !== null && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded shadow-xl text-center">
            <h3 className="text-xl font-bold mb-4">Are you sure?</h3>
            <p className="mb-4">You are about to delete this news feed.</p>
            <div className="space-x-4">
              <button
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
                onClick={() => confirmDeleteFeed(confirmDelete)}
              >
                Yes, Delete
              </button>
              <button
                className="bg-gray-300 text-[#333] px-4 py-2 rounded hover:bg-gray-400 transition"
                onClick={() => setConfirmDelete(null)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {showAddDialog && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded shadow-xl max-w-md w-full">
            <h3 className="text-xl font-bold mb-4">Add News Feed</h3>

            <input
              type="text"
              placeholder="Title"
              value={newFeed.title}
              onChange={(e) =>
                setNewFeed({ ...newFeed, title: e.target.value })
              }
              className="w-full mb-3 p-2 border rounded"
            />
            <textarea
              placeholder="Description"
              value={newFeed.description}
              onChange={(e) =>
                setNewFeed({ ...newFeed, description: e.target.value })
              }
              className="w-full mb-3 p-2 border rounded"
            ></textarea>
            <input
              type="text"
              placeholder="Image URL"
              value={newFeed.imageUrl}
              onChange={(e) =>
                setNewFeed({ ...newFeed, imageUrl: e.target.value })
              }
              className="w-full mb-4 p-2 border rounded"
            />

            <div className="flex justify-end space-x-2">
              <button
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition"
                onClick={handleAddNews}
              >
                Add
              </button>
              <button
                className="bg-gray-300 text-[#333333] px-4 py-2 rounded hover:bg-gray-400 transition"
                onClick={() => setShowAddDialog(false)}
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
