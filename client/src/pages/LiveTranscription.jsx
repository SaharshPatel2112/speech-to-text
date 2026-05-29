import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function LiveTranscription() {
  const navigate = useNavigate();
  const [status, setStatus] = useState("idle");
  const [lines, setLines] = useState([]);
  const [interimText, setInterimText] = useState("");
  const [error, setError] = useState("");
  const wsRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const streamRef = useRef(null);
  const currentLineRef = useRef("");
  const timerRef = useRef(null);

  const resetTimer = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      setLines((prev) => {
        if (prev.length === 0) return prev;
        return prev.slice(1); // remove first line after 8 seconds
      });
      currentLineRef.current = "";
    }, 2500);
  };

  const startLive = async () => {
    setError("");
    setStatus("connecting");
    setLines([]);
    setInterimText("");
    currentLineRef.current = "";

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      const ws = new WebSocket("ws://localhost:5000/live");
      wsRef.current = ws;

      ws.onopen = () => console.log("WebSocket connected");

      ws.onmessage = (event) => {
        const data = JSON.parse(event.data);

        if (data.type === "ready") {
          setStatus("active");
          startStreaming(stream, ws);
        }

        if (data.type === "transcript") {
          if (data.isFinal && data.transcript.trim()) {
            setInterimText("");

            // Append to current line
            const newWord = data.transcript.trim();
            const updatedLine = currentLineRef.current
              ? currentLineRef.current + " " + newWord
              : newWord;

            currentLineRef.current = updatedLine;
            resetTimer();

            setLines((prev) => {
              // If we have less than 2 lines, update or add current line
              if (prev.length < 2) {
                if (prev.length === 0) return [updatedLine];
                // Check if current line is being built (same as last)
                const isUpdatingLast =
                  prev[prev.length - 1] !== updatedLine &&
                  prev[prev.length - 1].split(" ").length < 6;
                if (isUpdatingLast) {
                  return [...prev.slice(0, -1), updatedLine];
                }
                return [...prev, updatedLine];
              }

              // Both lines full — check word count of last line
              const lastLine = prev[prev.length - 1];
              if (lastLine.split(" ").length < 6) {
                // Still building last line
                return [...prev.slice(0, -1), updatedLine];
              }

              // Last line is full — remove first, shift second, start new
              currentLineRef.current = newWord;
              return [prev[1], newWord];
            });
          } else if (!data.isFinal) {
            setInterimText(data.transcript);
          }
        }

        if (data.type === "error") {
          setError(data.message);
          stopLive();
        }
      };

      ws.onerror = () => {
        setError("WebSocket connection failed.");
        setStatus("idle");
      };

      ws.onclose = () => {
        setStatus((prev) => (prev === "active" ? "stopped" : prev));
      };
    } catch (err) {
      if (err.name === "NotAllowedError") {
        setError("Microphone access denied.");
      } else {
        setError("Could not access microphone.");
      }
      setStatus("idle");
    }
  };

  const startStreaming = (stream, ws) => {
    const mediaRecorder = new MediaRecorder(stream, {
      mimeType: "audio/webm;codecs=opus",
    });
    mediaRecorderRef.current = mediaRecorder;

    mediaRecorder.ondataavailable = (e) => {
      if (e.data.size > 0 && ws.readyState === WebSocket.OPEN) {
        ws.send(e.data);
      }
    };

    mediaRecorder.start(250);
  };

  const stopLive = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    mediaRecorderRef.current?.stop();
    streamRef.current?.getTracks().forEach((t) => t.stop());
    wsRef.current?.close();
    setStatus("stopped");
    setInterimText("");
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      mediaRecorderRef.current?.stop();
      streamRef.current?.getTracks().forEach((t) => t.stop());
      wsRef.current?.close();
    };
  }, []);

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <header className="border-b border-gray-800 py-4 px-6">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <button
            onClick={() => {
              stopLive();
              navigate("/");
            }}
            className="flex items-center gap-2 text-gray-400 hover:text-white transition text-sm"
          >
            ← Back
          </button>
          <div className="flex items-center gap-2">
            <img src="/Logo.svg" alt="SpeechText" className="w-7 h-7" />
            <span className="font-semibold">Live Transcription</span>
          </div>
          <div className="w-16" />
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 pt-10 pb-6">
        {/* Status indicator */}
        <div className="flex items-center justify-center gap-3 mb-6">
          {status === "active" && (
            <>
              <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
              <span className="text-red-400 text-sm font-medium">Live</span>
            </>
          )}
          {status === "connecting" && (
            <>
              <div className="w-4 h-4 border-2 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
              <span className="text-blue-400 text-sm">Connecting...</span>
            </>
          )}
          {status === "stopped" && (
            <span className="text-gray-500 text-sm">Session ended</span>
          )}
          {status === "idle" && (
            <span className="text-gray-600 text-sm">Press start to begin</span>
          )}
        </div>

        {/* Live transcript display */}
        <div className="bg-black border border-gray-800 rounded-2xl p-8 min-h-44 flex flex-col items-center justify-center mb-6">
          {lines.length === 0 && !interimText ? (
            <p className="text-gray-600 text-sm">
              Transcription will appear here...
            </p>
          ) : (
            <div className="w-full text-center space-y-3">
              {lines.map((line, i) => (
                <p
                  key={i}
                  className={`text-xl leading-relaxed transition-all duration-300 ${
                    i === lines.length - 1
                      ? "text-white font-medium"
                      : "text-gray-500"
                  }`}
                >
                  {line}
                </p>
              ))}
              {interimText && (
                <p className="text-blue-400 text-xl italic leading-relaxed">
                  {interimText}
                </p>
              )}
            </div>
          )}
        </div>

        {error && (
          <div className="bg-red-950 border border-red-800 rounded-xl px-4 py-3 mb-5">
            <p className="text-red-400 text-sm">{error}</p>
          </div>
        )}

        {/* Control button */}
        <div className="flex justify-center">
          {status === "idle" || status === "stopped" ? (
            <button
              onClick={startLive}
              className="px-10 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-xl transition"
            >
              {status === "stopped"
                ? "Start Again"
                : "Start Live Transcription"}
            </button>
          ) : status === "active" ? (
            <button
              onClick={stopLive}
              className="px-10 py-3 bg-gray-700 hover:bg-gray-600 text-white font-semibold rounded-xl transition"
            >
              Stop
            </button>
          ) : null}
        </div>
      </div>
    </div>
  );
}

export default LiveTranscription;
