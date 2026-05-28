import { useState, useRef } from "react";
import API, { setAuthToken } from "../api";
import { useAuth } from "@clerk/clerk-react";

function AudioRecorder({ setTranscription, setLoading, setError, loading }) {
  const { getToken } = useAuth();
  const [recording, setRecording] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);
  const timerRef = useRef(null);

  const startRecording = async () => {
    setError("");
    setTranscription("");
    chunksRef.current = [];
    setSeconds(0);

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      mediaRecorder.onstop = async () => {
        clearInterval(timerRef.current);
        const blob = new Blob(chunksRef.current, { type: "audio/webm" });
        const formData = new FormData();
        formData.append("audio", blob, "recording.webm");

        // Refresh token before request
        const token = await getToken();
        setAuthToken(token);

        setLoading(true);
        try {
          const res = await API.post("/upload", formData, {
            headers: { "Content-Type": "multipart/form-data" },
          });
          setTranscription(res.data.transcription);
        } catch (err) {
          const message =
            err.response?.data?.error ||
            "Recording transcription failed. Please try again.";
          setError(message);
        } finally {
          setLoading(false);
        }
      };

      mediaRecorder.start();
      setRecording(true);

      timerRef.current = setInterval(() => {
        setSeconds((prev) => prev + 1);
      }, 1000);
    } catch (err) {
      if (err.name === "NotAllowedError") {
        setError(
          "Microphone access denied. Please allow microphone permission.",
        );
      } else {
        setError("Could not access microphone. Please check your device.");
      }
    }
  };

  const stopRecording = () => {
    mediaRecorderRef.current?.stop();
    setRecording(false);
  };

  const formatTime = (s) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${sec.toString().padStart(2, "0")}`;
  };

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-2xl p-4 hover:border-gray-600 transition">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-2 h-2 bg-red-500 rounded-full"></div>
        <h2 className="text-base font-semibold text-gray-200">Record Audio</h2>
      </div>

      <button
        onClick={recording ? stopRecording : startRecording}
        disabled={loading}
        className={`w-full py-3 rounded-xl font-semibold transition-all ${
          loading
            ? "bg-gray-800 text-gray-500 cursor-not-allowed"
            : recording
              ? "bg-red-600 hover:bg-red-700 text-white"
              : "bg-blue-600 hover:bg-blue-700 text-white"
        }`}
      >
        {loading
          ? "Processing..."
          : recording
            ? "Stop Recording"
            : "Start Recording"}
      </button>

      {recording && (
        <div className="flex items-center justify-center gap-2 mt-3">
          <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
          <p className="text-red-400 text-sm">
            Recording — {formatTime(seconds)}
          </p>
        </div>
      )}
    </div>
  );
}

export default AudioRecorder;
