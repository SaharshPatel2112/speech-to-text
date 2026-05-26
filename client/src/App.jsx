import { useState } from "react";
import FileUpload from "./components/FileUpload";
import AudioRecorder from "./components/AudioRecorder";
import TranscriptionResult from "./components/TranscriptionResult";
import TranscriptionHistory from "./components/TranscriptionHistory";

function App() {
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
      {/* Header */}
      <header className="border-b border-gray-800 py-4 px-6">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-sm font-bold">
              S
            </div>
            <span className="font-semibold text-lg">SpeechText</span>
          </div>
        </div>
      </header>

      {/* Hero */}
      <div className="max-w-3xl mx-auto px-4 pt-12 pb-6 text-center">
        <h1 className="text-5xl font-extrabold tracking-tight mb-3 bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
          Speech to Text
        </h1>
        <p className="text-gray-400 text-lg">
          Upload or record audio and get instant transcriptions
        </p>
      </div>

      {/* Main Content */}
      <div className="max-w-3xl mx-auto px-4 pb-16">
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
          <TranscriptionResult
            transcription={transcription}
            loading={loading}
            error={error}
          />
        </div>

        <TranscriptionHistory key={refreshKey} />
      </div>
    </div>
  );
}

export default App;
