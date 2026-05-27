import { useState } from "react";
import API from "../api";
import ErrorMessage from "./ErrorMessage";

function FileUpload({ setTranscription, setLoading, setError, loading }) {
  const [fileName, setFileName] = useState("");
  const [localError, setLocalError] = useState("");

  const ALLOWED_TYPES = [
    "audio/mpeg",
    "audio/wav",
    "audio/mp4",
    "audio/webm",
    "audio/ogg",
  ];
  const MAX_SIZE_MB = 25;

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setLocalError("");
    setError("");

    // Client side validation
    if (!ALLOWED_TYPES.includes(file.type)) {
      setLocalError(
        "Invalid file type. Only mp3, wav, webm, ogg and mp4 are allowed.",
      );
      return;
    }

    if (file.size > MAX_SIZE_MB * 1024 * 1024) {
      setLocalError(`File too large. Maximum size is ${MAX_SIZE_MB}MB.`);
      return;
    }

    setFileName(file.name);
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
      const message =
        err.response?.data?.error || "Upload failed. Please try again.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 hover:border-gray-600 transition">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
        <h2 className="text-base font-semibold text-gray-200">
          Upload Audio File
        </h2>
      </div>

      <label
        className={`flex flex-col items-center justify-center w-full h-36 border-2 border-dashed rounded-xl transition ${
          loading
            ? "border-gray-700 cursor-not-allowed opacity-50"
            : "border-gray-700 cursor-pointer hover:border-blue-500 hover:bg-gray-800"
        }`}
      >
        <svg
          className="w-8 h-8 text-gray-500 mb-2"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"
          />
        </svg>
        <span className="text-gray-400 text-sm text-center px-4">
          {loading
            ? "Processing..."
            : fileName
              ? fileName
              : "Click to upload .mp3, .wav, .webm, .ogg"}
        </span>
        <span className="text-gray-600 text-xs mt-1">Max size: 25MB</span>
        <input
          type="file"
          accept="audio/*"
          className="hidden"
          onChange={handleFileChange}
          disabled={loading}
        />
      </label>

      <div className="mt-3">
        <ErrorMessage message={localError} />
      </div>
    </div>
  );
}

export default FileUpload;
