import { useState } from "react";

function TranscriptionResult({ transcription, loading, error }) {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(transcription);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 hover:border-gray-600 transition">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
        <h2 className="text-base font-semibold text-gray-200">Transcription</h2>
      </div>

      {loading && (
        <div className="flex items-center gap-3">
          <div className="w-5 h-5 border-2 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-blue-400 text-sm">Transcribing audio...</p>
        </div>
      )}

      {error && (
        <div className="bg-red-950 border border-red-800 rounded-xl px-4 py-3">
          <p className="text-red-400 text-sm">{error}</p>
        </div>
      )}

      {!loading && !error && transcription && (
        <>
          <p className="text-gray-200 leading-relaxed text-sm">
            {transcription}
          </p>
          <button
            onClick={copyToClipboard}
            className="mt-4 px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-sm text-gray-300 transition"
          >
            {copied ? "Copied!" : "Copy to Clipboard"}
          </button>
        </>
      )}

      {!loading && !error && !transcription && (
        <p className="text-gray-600 text-sm">
          Transcription will appear here after upload or recording.
        </p>
      )}
    </div>
  );
}

export default TranscriptionResult;
