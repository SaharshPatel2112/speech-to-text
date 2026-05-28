import { useState } from "react";
import { UserButton } from "@clerk/clerk-react";
import FileUpload from "./components/FileUpload";
import AudioRecorder from "./components/AudioRecorder";
import TranscriptionResult from "./components/TranscriptionResult";
import TranscriptionHistory from "./components/TranscriptionHistory";
import AuthWrapper from "./components/AuthWrapper";
import useAuthToken from "./hooks/useAuthToken";

function App() {
  useAuthToken();
  const [transcription, setTranscription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);

  const handleTranscriptionDone = (text) => {
    setTranscription(text);
    setRefreshKey((prev) => prev + 1);
  };

  return (
    <AuthWrapper>
      <div className="min-h-screen bg-gray-950 text-white">
        {/* Header */}
        <header className="border-b border-gray-800 py-4 px-6">
          <div className="max-w-6xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-2">
              <img src="/Logo.svg" alt="SpeechText" className="w-8 h-8" />
              <span className="font-semibold text-lg">SpeechText</span>
            </div>
            <UserButton afterSignOutUrl="/" />
          </div>
        </header>

        {/* Hero */}
        <div className="max-w-6xl mx-auto px-4 pt-12 pb-6 text-center">
          <h1 className="text-5xl font-extrabold tracking-tight mb-3 bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
            Speech to Text
          </h1>
          <p className="text-gray-400 text-lg">
            Upload or record audio and get instant transcriptions
          </p>
        </div>

        {/* Main Content */}
        <div className="max-w-6xl mx-auto px-4 pb-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {/* Left column */}
            <div className="flex flex-col gap-5">
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
    </AuthWrapper>
  );
}

export default App;
