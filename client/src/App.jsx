import { useState } from "react";
import { Routes, Route } from "react-router-dom";
import { UserButton } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";
import FileUpload from "./components/FileUpload";
import AudioRecorder from "./components/AudioRecorder";
import TranscriptionResult from "./components/TranscriptionResult";
import TranscriptionHistory from "./components/TranscriptionHistory";
import AuthWrapper from "./components/AuthWrapper";
import LiveTranscription from "./pages/LiveTranscription";
import useAuthToken from "./hooks/useAuthToken";

function MainPage() {
  const navigate = useNavigate();
  const [transcription, setTranscription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);

  const handleTranscriptionDone = (text) => {
    setTranscription(text);
    setRefreshKey((prev) => prev + 1);
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <header className="border-b border-gray-800 py-4 px-6">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img src="/Logo.svg" alt="SpeechText" className="w-8 h-8" />
            <span className="font-semibold text-lg">Speech2Text</span>
          </div>
          <div className="flex items-center gap-4">
            <UserButton afterSignOutUrl="/" />
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 pt-12 pb-6 text-center">
        <h1 className="text-5xl font-extrabold tracking-tight mb-3 bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
          Speech to Text
        </h1>
        <p className="text-gray-400 text-lg">
          Upload or record audio and get instant transcriptions
        </p>
      </div>

      <div className="max-w-6xl mx-auto px-4 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {/* Left column */}
          <div className="flex flex-col gap-5">
            {/* Live Transcription card */}
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                    <span className="text-sm font-semibold text-white">
                      Live Transcription
                    </span>
                  </div>
                  <p className="text-gray-500 text-xs">
                    Real-time speech to text
                  </p>
                </div>
                <button
                  onClick={() => navigate("/live")}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition"
                >
                  <span className="text-white text-sm font-medium">Go to Live</span>
                  <svg
                    className="w-4 h-4 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 7l5 5m0 0l-5 5m5-5H6"
                    />
                  </svg>
                </button>
              </div>
            </div>

            <FileUpload
              setTranscription={handleTranscriptionDone}
              setLoading={setLoading}
              setError={setError}
              loading={loading}
            />
            <AudioRecorder
              setTranscription={handleTranscriptionDone}
              setLoading={setLoading}
              setError={setError}
              loading={loading}
            />
          </div>

          {/* Right column */}
          <div className="flex flex-col gap-5">
            <TranscriptionResult
              transcription={transcription}
              loading={loading}
              error={error}
            />
          </div>
        </div>
        <TranscriptionHistory key={refreshKey} />
      </div>
    </div>
  );
}

function App() {
  useAuthToken();

  return (
    <AuthWrapper>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/live" element={<LiveTranscription />} />
      </Routes>
    </AuthWrapper>
  );
}

export default App;
