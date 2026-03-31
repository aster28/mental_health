const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

let dataset = [];
try {
  dataset = JSON.parse(fs.readFileSync(path.join(__dirname, "data.json")));
  console.log("✅ Data loaded:", dataset.length);
} catch(err) {
  console.error("❌ Error loading data.json:", err);
}

app.post("/chat", (req,res)=>{
  try{
    const input = (req.body.message||"").toLowerCase().trim();

    // AI-like understanding
    if(input.includes("sad")||input.includes("low")||input.includes("hopeless"))
      return res.json({reply:"😞 You may be experiencing depression. Try typing 'depression' to learn more."});
    if(input.includes("anxious")||input.includes("panic")||input.includes("nervous"))
      return res.json({reply:"😰 This may relate to anxiety. Type 'anxiety' for remedies."});
    if(input.includes("hear voices")||input.includes("see things")||input.includes("not real"))
      return res.json({reply:"🧠 These symptoms may relate to schizophrenia. Type 'schizophrenia' to learn more."});
    if(input.includes("no motivation")||input.includes("no energy"))
      return res.json({reply:"🧪 This may relate to dopamine imbalance. Type 'dopamine' to learn more."});

    for(let item of dataset){
      const question = (item.question||"").toLowerCase();
      const keywords = item.keywords||[];
      if(input.includes(question)||question.includes(input)||keywords.some(k=>input.includes(k.toLowerCase())))
        return res.json({reply:item.answer});
    }

    return res.json({reply:"🤖 Sorry, I couldn't understand. Try keywords like schizophrenia, anxiety, dopamine."});
  }catch(err){
    console.error(err);
    return res.status(500).json({reply:"❌ Server error"});
  }
});

app.get("*",(req,res)=>{
  res.sendFile(path.join(__dirname,"public","index.html"));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT,()=>console.log("🚀 Server running on port",PORT));