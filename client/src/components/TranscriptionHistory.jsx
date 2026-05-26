import { useEffect, useState } from "react";
import API from "../api";

function TranscriptionHistory() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchHistory = async () => {
    try {
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
      <div className="flex items-center gap-3 mt-8">
        <div className="w-5 h-5 border-2 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-blue-400">Loading history...</p>
      </div>
    );
  }

  if (history.length === 0) {
    return (
      <p className="text-gray-500 mt-8 text-center">
        No transcription history yet.
      </p>
    );
  }

  return (
    <div className="mt-10">
      <h2 className="text-xl font-semibold mb-4">Previous Transcriptions</h2>
      <div className="flex flex-col gap-4">
        {history.map((item) => (
          <div
            key={item.id}
            className="bg-gray-900 border border-gray-700 rounded-2xl p-5"
          >
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-blue-400">
                {item.filename}
              </span>
              <span className="text-xs text-gray-500">
                {new Date(item.created_at).toLocaleString()}
              </span>
            </div>
            <p className="text-gray-300 text-sm leading-relaxed">
              {item.transcription}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default TranscriptionHistory;
