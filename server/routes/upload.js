const express = require("express");
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const deepgram = require("../deepgram");
const router = express.Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const allowedTypes = [
      "audio/mpeg",
      "audio/wav",
      "audio/mp4",
      "audio/webm",
      "audio/ogg",
    ];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Invalid file type. Only audio files are allowed."));
    }
  },
});

router.post("/upload", upload.single("audio"), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }

  const filePath = path.join(__dirname, "../uploads", req.file.filename);

  try {
    const audioBuffer = fs.readFileSync(filePath);

    const response = await deepgram.transcription.preRecorded(
      { buffer: audioBuffer, mimetype: req.file.mimetype },
      {
        model: "nova-2",
        smart_format: true,
        punctuate: true,
      },
    );

    const transcription =
      response.results.channels[0].alternatives[0].transcript;

    fs.unlinkSync(filePath);

    res.json({
      message: "Transcription successful",
      filename: req.file.originalname,
      transcription,
    });
  } catch (err) {
    console.error("Transcription error:", err.message);
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    res.status(500).json({ error: "Transcription failed: " + err.message });
  }
});

module.exports = router;
