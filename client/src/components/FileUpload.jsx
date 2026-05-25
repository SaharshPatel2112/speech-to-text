import { useState } from "react";
import API from "../api";

function FileUpload({ setTranscription, setLoading, setError, loading }) {
  const [fileName, setFileName] = useState("");

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setFileName(file.name);
    setError("");
    setLoading(true);
    setTranscription("");

    const formData = new FormData();
    formData.append("audio", file);

    try {
      const res = await API.post("/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setTranscription(res.data.transcription);
    } catch (err) {
      setError("Upload failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-900 border border-gray-700 rounded-2xl p-6">
      <h2 className="text-lg font-semibold mb-4">Upload Audio File</h2>
      <label
        className={`flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-xl transition ${
          loading
            ? "border-gray-700 cursor-not-allowed opacity-50"
            : "border-gray-600 cursor-pointer hover:border-blue-500"
        }`}
      >
        <span className="text-gray-400 text-sm">
          {loading
            ? "Processing..."
            : fileName
              ? fileName
              : "Click to upload .mp3, .wav, .webm"}
        </span>
        <input
          type="file"
          accept="audio/*"
          className="hidden"
          onChange={handleFileChange}
          disabled={loading}
        />
      </label>
    </div>
  );
}

export default FileUpload;
