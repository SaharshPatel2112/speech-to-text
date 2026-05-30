const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const http = require("http");
const uploadRoute = require("./routes/upload");
const setupLiveTranscription = require("./liveTranscription");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(
  cors({
    origin: ["http://localhost:5173", "https://speech-to-text-ochre.vercel.app"],
    credentials: true,
  }),
);
app.use(express.json());
app.use("/api", uploadRoute);

app.get("/", (req, res) => {
  res.send("Server is running");
});

const server = http.createServer(app);
setupLiveTranscription(server);

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
