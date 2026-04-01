const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");
const natural = require("natural");

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// =======================
// 🧠 ML CLASSIFIER SETUP
// =======================
const classifier = new natural.BayesClassifier();
const modelPath = path.join(__dirname, "model.json");

// Load or train model
if (fs.existsSync(modelPath)) {
  classifier.load(modelPath, null, () => {
    console.log("✅ ML model loaded");
  });
} else {
  console.log("⚡ Training ML model...");

  classifier.addDocument("I feel sad and tired", "depression");
  classifier.addDocument("I feel hopeless", "depression");

  classifier.addDocument("I feel panic and fear", "anxiety");
  classifier.addDocument("I am nervous", "anxiety");

  classifier.addDocument("I hear voices", "schizophrenia");
  classifier.addDocument("I see things not real", "schizophrenia");

  classifier.addDocument("I can't sleep", "insomnia");

  classifier.train();

  classifier.save(modelPath, () => {
    console.log("💾 ML model saved");
  });
}

// =======================
// 📚 LOAD DATASET
// =======================
let dataset = [];
try {
  const data = fs.readFileSync(path.join(__dirname, "data.json"), "utf-8");
  dataset = JSON.parse(data);
  console.log("✅ Dataset loaded:", dataset.length);
} catch (err) {
  console.error("❌ Error loading data.json:", err);
}

// =======================
// 💬 CHAT API
// =======================
app.post("/chat", (req, res) => {
  try {
    const input = (req.body.message || "").toLowerCase();

    // =======================
    // 🧠 ML DETECTION (TOP 3)
    // =======================
    const classifications = classifier.getClassifications(input);

    classifications.sort((a, b) => b.value - a.value);
    const top3 = classifications.slice(0, 3);

    // If ML confident → use it
    if (top3[0].value > 0.4) {
      let reply = "🧠 Possible conditions:\n\n";

      top3.forEach((item, i) => {
        reply += `${i + 1}. ${item.label} (${(item.value * 100).toFixed(1)}%)\n`;
      });

      reply += "\n⚠️ Not a medical diagnosis.";

      return res.json({ reply });
    }

    // =======================
    // 📚 DATASET MATCH
    // =======================
    for (let item of dataset) {
      if (
        input.includes(item.question) ||
        item.keywords.some(k => input.includes(k))
      ) {
        return res.json({ reply: item.answer });
      }
    }

    // =======================
    // 🤖 FALLBACK
    // =======================
    return res.json({
      reply:
        "🤖 Try describing symptoms like 'sad, anxious, can't sleep' or ask about schizophrenia, dopamine, anxiety."
    });

  } catch (err) {
    console.error("❌ CHAT ERROR:", err);
    return res.status(500).json({ reply: "❌ Server error" });
  }
});

// =======================
// 🌐 FRONTEND
// =======================
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// =======================
// 🚀 START SERVER
// =======================
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("🚀 Server running on port", PORT);
});