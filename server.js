const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(express.json());

// Load JSON data safely
const dataPath = path.join(__dirname, 'data.json'); // make sure data.json is here
let botData;

try {
  botData = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
} catch (err) {
  console.error("Failed to load JSON:", err);
  process.exit(1); // stop server if JSON invalid
}

// Simple POST endpoint for chatbot
app.post('/chat', (req, res) => {
  const message = req.body.message.toLowerCase();

  // Search in FAQ by exact match
  const faq = botData.faq.find(f => f.question.toLowerCase() === message);

  if (faq) {
    res.json({ reply: faq.answer });
  } else {
    res.json({ reply: "I don't understand. Try asking about schizophrenia, dopamine, or anxiety." });
  }
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});