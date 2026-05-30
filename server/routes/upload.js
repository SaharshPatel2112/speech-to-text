const express = require("express");
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const deepgram = require("../deepgram");
const supabase = require("../supabase");
const router = express.Router();

const uploadsDir = path.join(__dirname, "../uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const requireAuth = require("../middleware/requireAuth");

const MAX_FILE_SIZE = 25 * 1024 * 1024; // 25MB

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
  limits: { fileSize: MAX_FILE_SIZE },
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
      cb(new Error("INVALID_FILE_TYPE"));
    }
  },
});

// Multer error handler middleware
const handleUpload = (req, res, next) => {
  upload.single("audio")(req, res, (err) => {
    if (err) {
      if (err.code === "LIMIT_FILE_SIZE") {
        return res
          .status(400)
          .json({ error: "File too large. Maximum size is 25MB." });
      }
      if (err.message === "INVALID_FILE_TYPE") {
        return res.status(400).json({
          error:
            "Invalid file type. Only mp3, wav, webm, ogg and mp4 are allowed.",
        });
      }
      return res.status(400).json({ error: err.message });
    }
    next();
  });
};

router.post("/upload", requireAuth, handleUpload, async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded." });
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

    if (!response?.results?.channels?.[0]?.alternatives?.[0]) {
      throw new Error("Deepgram returned an empty response.");
    }

    const transcription =
      response.results.channels[0].alternatives[0].transcript;

    if (!transcription || transcription.trim() === "") {
      fs.unlinkSync(filePath);
      return res.status(422).json({
        error: "No speech detected in the audio. Please try again.",
      });
    }

    fs.unlinkSync(filePath);

    const { error: dbError } = await supabase
      .from("transcriptions")
      .insert([
        { filename: req.file.originalname, transcription, user_id: req.userId },
      ]);

    if (dbError) {
      console.error("Supabase insert error:", dbError.message);
    }

    res.json({
      message: "Transcription successful",
      filename: req.file.originalname,
      transcription,
    });
  } catch (err) {
    console.error("Transcription error:", err.message);
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);

    if (err.message.includes("ENOENT")) {
      return res.status(500).json({ error: "File processing failed." });
    }
    if (err.message.includes("fetch") || err.message.includes("network")) {
      return res.status(503).json({
        error: "Could not reach Deepgram. Check your internet connection.",
      });
    }

    res.status(500).json({ error: "Transcription failed. Please try again." });
  }
});

router.get("/transcriptions", requireAuth, async (req, res) => {
  const { data, error } = await supabase
    .from("transcriptions")
    .select("*")
    .eq("user_id", req.userId)
    .order("created_at", { ascending: false });

  if (error) {
    return res.status(500).json({ error: "Failed to fetch transcriptions." });
  }

  res.json(data);
});

module.exports = router;
