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

    // 🧠 AI-like intent detection
    if (input.includes("sad") || input.includes("low") || input.includes("hopeless")) {
      return res.json({ reply: "😞 It sounds like depression. Try typing 'depression' to learn more." });
    }

    if (input.includes("anxious") || input.includes("panic") || input.includes("nervous")) {
      return res.json({ reply: "😰 This may relate to anxiety. Type 'anxiety' for treatments and remedies." });
    }

    if (input.includes("hear voices") || input.includes("see things") || input.includes("not real")) {
      return res.json({ reply: "🧠 These symptoms may relate to schizophrenia or hallucinations. Type 'schizophrenia' to learn more." });
    }

    if (input.includes("no motivation") || input.includes("no energy") || input.includes("lazy")) {
      return res.json({ reply: "🧪 This may relate to dopamine imbalance. Type 'dopamine' to learn more." });
    }

    // 🔍 Smart dataset matching
    for (let item of dataset) {
      const question = (item.question || "").toLowerCase();
      const keywords = item.keywords || [];

      if (
        input.includes(question) ||
        question.includes(input) ||
        keywords.some(k => input.includes(k.toLowerCase()))
      ) {
        return res.json({ reply: item.answer });
      }
    }

    // ❌ Default response
    return res.json({
      reply: "🤖 I couldn't fully understand. Try asking about schizophrenia, anxiety, dopamine, or symptoms."
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