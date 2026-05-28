const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const http = require("http");
const uploadRoute = require("./routes/upload");
const setupLiveTranscription = require("./liveTranscription");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use("/api", uploadRoute);

app.get("/", (req, res) => {
  res.send("Server is running");
});

// Create HTTP server and attach WebSocket
const server = http.createServer(app);
setupLiveTranscription(server);

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
