import { useState } from "react";
import axios from "axios";

function FileUpload({ setTranscription, setLoading, setError }) {
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
      const res = await axios.post(
        "http://localhost:5000/api/upload",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } },
      );
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
      <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-600 rounded-xl cursor-pointer hover:border-blue-500 transition">
        <span className="text-gray-400 text-sm">
          {fileName ? fileName : "Click to upload .mp3, .wav, .webm"}
        </span>
        <input
          type="file"
          accept="audio/*"
          className="hidden"
          onChange={handleFileChange}
        />
      </label>
    </div>
  );
}

export default FileUpload;
