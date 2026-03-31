const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// Load dataset
let dataset = [];
try {
  dataset = JSON.parse(fs.readFileSync(path.join(__dirname, "data.json")));
  console.log("✅ Data loaded:", dataset.length);
} catch (err) {
  console.error("❌ Error loading data.json:", err);
}

// Chat API
app.post("/chat", (req, res) => {
  try {
    const input = (req.body.message || "").toLowerCase().trim();

    for (let item of dataset) {
      const question = (item.question || "").toLowerCase();
      const keywords = item.keywords || [];

      if (input.includes(question) || question.includes(input)) {
        return res.json({ reply: item.answer });
      }

      for (let key of keywords) {
        if (input.includes(key.toLowerCase())) {
          return res.json({ reply: item.answer });
        }
      }
    } // ✅ CLOSE for-loop properly

    // No match
    return res.json({
      reply: "🤖 Sorry, no information found. Try keywords like schizophrenia, dopamine, anxiety."
    });

  } catch (err) {
    console.error("❌ CHAT ERROR:", err);
    return res.status(500).json({ reply: "❌ Server error" });
  }
});

// Frontend fallback (ONLY ONCE)
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Start server (ONLY ONCE)
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("🚀 Server running on port", PORT);
});