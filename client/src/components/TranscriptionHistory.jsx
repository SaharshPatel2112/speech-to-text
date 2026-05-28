import { useEffect, useState } from "react";
import { useAuth } from "@clerk/clerk-react";
import API, { setAuthToken } from "../api";

function TranscriptionHistory() {
  const { getToken } = useAuth();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAll, setShowAll] = useState(false);

  const fetchHistory = async () => {
    try {
      const token = await getToken();
      setAuthToken(token);
      const res = await API.get("/transcriptions");
      setHistory(res.data);
    } catch (err) {
      console.error("Failed to fetch history:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center gap-3 mt-10">
        <div className="w-5 h-5 border-2 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-blue-400 text-sm">Loading history...</p>
      </div>
    );
  }

  if (history.length === 0) {
    return (
      <p className="text-gray-600 mt-10 text-center text-sm">
        No transcription history yet.
      </p>
    );
  }

  const displayed = showAll ? history : history.slice(0, 5);

  return (
    <div className="mt-10">
      <div className="flex items-center gap-2 mb-5">
        <h2 className="text-lg font-semibold text-gray-200">Recent History</h2>
        <span className="text-xs bg-gray-800 text-gray-400 px-2 py-0.5 rounded-full">
          {history.length}
        </span>
      </div>

      <div className="flex flex-col gap-4">
        {displayed.map((item) => (
          <div
            key={item.id}
            className="bg-gray-900 border border-gray-800 rounded-2xl p-5 hover:border-gray-600 transition"
          >
            <div className="flex justify-between items-center mb-3">
              <span className="text-xs font-medium text-blue-400 bg-blue-950 px-2 py-1 rounded-lg">
                {item.filename}
              </span>
              <span className="text-xs text-gray-600">
                {new Date(item.created_at).toLocaleString()}
              </span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              {item.transcription}
            </p>
          </div>
        ))}
      </div>

      {history.length > 5 && (
        <button
          onClick={() => setShowAll((prev) => !prev)}
          className="mt-5 w-full py-2.5 rounded-xl text-sm text-gray-400 border border-gray-800 hover:border-gray-600 hover:text-gray-200 transition"
        >
          {showAll ? "Show Less" : `See All ${history.length} Transcriptions`}
        </button>
      )}
    </div>
  );
}

export default TranscriptionHistory;
