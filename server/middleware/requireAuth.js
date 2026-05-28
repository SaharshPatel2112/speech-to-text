const jwt = require("jsonwebtoken");

const requireAuth = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Unauthorized. Please sign in." });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.decode(token);
    if (!decoded || !decoded.sub) {
      return res.status(401).json({ error: "Invalid or expired session." });
    }
    req.userId = decoded.sub;
    next();
  } catch (err) {
    console.error("Auth error:", err.message);
    return res.status(401).json({ error: "Invalid or expired session." });
  }
};

module.exports = requireAuth;
