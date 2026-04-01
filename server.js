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
    const input = (req.body.message || "").toLowerCase();

    // 🧠 Symptom detection
    let score = {
     depression: 0,
     anxiety: 0,
     schizophrenia: 0,
     insomnia: 0
};

   if (input.includes("sad")) score.depression++;
   if (input.includes("tired")) score.depression++;
   if (input.includes("hopeless")) score.depression++;

   if (input.includes("fear")) score.anxiety++;
   if (input.includes("panic")) score.anxiety++;

   if (input.includes("voices")) score.schizophrenia++;
   if (input.includes("hallucination")) score.schizophrenia++;

   if (input.includes("no sleep")) score.insomnia++;

   let result = Object.keys(score).filter(k => score[k] > 0);

   if (result.length > 0) {
     return res.json({
     reply: `🧠 Possible conditions:\n👉 ${result.join(", ")}\n\n⚠️ Not a medical diagnosis.`
  });
}
    let severity = "mild";

    if (input.includes("very") || input.includes("extreme")) {
      severity = "severe";
}

      return res.json({
       reply: `🧠 Possible condition: depression\n⚡ Severity: ${severity}\n\n⚠️ Please consult a doctor.`
});
    // 🧠 If symptoms found
    if (detected.length > 0) {
      return res.json({
        reply: `🧠 Based on symptoms, possible conditions:\n\n👉 ${detected.join(", ")}\n\n⚠️ This is not a diagnosis. Consult a doctor.`
      });
    }

    // 📚 Dataset matching
    for (let item of dataset) {
      if (
        input.includes(item.question) ||
        item.keywords.some(k => input.includes(k))
      ) {
        return res.json({ reply: item.answer });
      }
    }

    // 🤖 Smart fallback
    return res.json({
      reply: "🤖 Try describing your symptoms like 'sad, tired, anxious, can't sleep'."
    });

  } catch (err) {
    console.error(err);
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