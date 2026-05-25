import { useState } from "react";
import FileUpload from "./components/FileUpload";
import AudioRecorder from "./components/AudioRecorder";
import TranscriptionResult from "./components/TranscriptionResult";

function App() {
  const [transcription, setTranscription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <div className="max-w-3xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-center mb-2 text-white">
          Speech to Text
        </h1>
        <p className="text-center text-gray-400 mb-10">
          Upload or record audio and get instant transcriptions
        </p>

        <div className="flex flex-col gap-6">
          <FileUpload
            setTranscription={setTranscription}
            setLoading={setLoading}
            setError={setError}
            loading={loading}
          />
          <AudioRecorder
            setTranscription={setTranscription}
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
      </div>
    </div>
  );
}

export default App;
