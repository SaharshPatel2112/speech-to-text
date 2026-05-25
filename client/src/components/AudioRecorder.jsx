import { useState, useRef } from "react";
import API from "../api";

function AudioRecorder({ setTranscription, setLoading, setError, loading }) {
  const [recording, setRecording] = useState(false);
  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);

  const startRecording = async () => {
    setError("");
    setTranscription("");
    chunksRef.current = [];

    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const mediaRecorder = new MediaRecorder(stream);
    mediaRecorderRef.current = mediaRecorder;

    mediaRecorder.ondataavailable = (e) => {
      if (e.data.size > 0) chunksRef.current.push(e.data);
    };

    mediaRecorder.onstop = async () => {
      const blob = new Blob(chunksRef.current, { type: "audio/webm" });
      const formData = new FormData();
      formData.append("audio", blob, "recording.webm");

      setLoading(true);
      try {
        const res = await API.post("/upload", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        setTranscription(res.data.transcription);
      } catch (err) {
        setError("Recording transcription failed. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    mediaRecorder.start();
    setRecording(true);
  };

  const stopRecording = () => {
    mediaRecorderRef.current?.stop();
    setRecording(false);
  };

  return (
    <div className="bg-gray-900 border border-gray-700 rounded-2xl p-6">
      <h2 className="text-lg font-semibold mb-4">Record Audio</h2>
      <button
        onClick={recording ? stopRecording : startRecording}
        disabled={loading}
        className={`w-full py-3 rounded-xl font-semibold transition ${
          loading
            ? "bg-gray-700 cursor-not-allowed opacity-50"
            : recording
              ? "bg-red-600 hover:bg-red-700"
              : "bg-blue-600 hover:bg-blue-700"
        }`}
      >
        {loading
          ? "Processing..."
          : recording
            ? "Stop Recording"
            : "Start Recording"}
      </button>
      {recording && (
        <p className="text-center text-red-400 text-sm mt-3 animate-pulse">
          Recording in progress...
        </p>
      )}
    </div>
  );
}

export default AudioRecorder;
