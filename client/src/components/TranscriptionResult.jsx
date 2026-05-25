function TranscriptionResult({ transcription, loading, error }) {
  const copyToClipboard = () => {
    navigator.clipboard.writeText(transcription);
  };

  return (
    <div className="bg-gray-900 border border-gray-700 rounded-2xl p-6">
      <h2 className="text-lg font-semibold mb-4">Transcription</h2>

      {loading && (
        <div className="flex items-center gap-3">
          <div className="w-5 h-5 border-2 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-blue-400">Transcribing audio...</p>
        </div>
      )}

      {error && <p className="text-red-400">{error}</p>}

      {!loading && !error && transcription && (
        <>
          <p className="text-gray-200 leading-relaxed">{transcription}</p>
          <button
            onClick={copyToClipboard}
            className="mt-4 px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-sm transition"
          >
            Copy to Clipboard
          </button>
        </>
      )}

      {!loading && !error && !transcription && (
        <p className="text-gray-500">
          Transcription will appear here after upload or recording.
        </p>
      )}
    </div>
  );
}

export default TranscriptionResult;
