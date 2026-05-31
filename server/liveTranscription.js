const WebSocket = require("ws");

function setupLiveTranscription(server) {
  const wss = new WebSocket.Server({ server, path: "/live" });

  wss.on("connection", (clientWs) => {
    const deepgramWs = new WebSocket(
      "wss://api.deepgram.com/v1/listen?model=nova-2&punctuate=true&interim_results=true&utterance_end_ms=1000",
      {
        headers: {
          Authorization: `Token ${process.env.DEEPGRAM_API_KEY}`,
        },
      },
    );

    deepgramWs.on("open", () => {
      clientWs.send(JSON.stringify({ type: "ready" }));
    });

    deepgramWs.on("message", (data) => {
      try {
        const parsed = JSON.parse(data);
        const transcript = parsed.channel?.alternatives?.[0]?.transcript || "";
        const isFinal = parsed.is_final || false;

        if (transcript.trim()) {
          clientWs.send(
            JSON.stringify({ type: "transcript", transcript, isFinal }),
          );
        }
      } catch (err) {
        console.error("Deepgram parse error:", err.message);
      }
    });

    deepgramWs.on("error", (err) => {
      console.error("Deepgram WS error:", err.message);
      clientWs.send(
        JSON.stringify({
          type: "error",
          message: "Deepgram connection failed.",
        }),
      );
    });

    deepgramWs.on("close", () => {});

    clientWs.on("message", (audioChunk) => {
      if (deepgramWs.readyState === WebSocket.OPEN) {
        deepgramWs.send(audioChunk);
      }
    });

    clientWs.on("close", () => {
      if (deepgramWs.readyState === WebSocket.OPEN) {
        deepgramWs.close();
      }
    });

    clientWs.on("error", (err) => {
      console.error("Client WS error:", err.message);
      deepgramWs.close();
    });
  });

  return wss;
}

module.exports = setupLiveTranscription;
