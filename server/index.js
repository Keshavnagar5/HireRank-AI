const express = require("express");
const cors = require("cors");

const resumeRoutes = require("./routes/resumeRoutes");

const app = express();

// ✅ Allow frontend (for now allow all)
app.use(cors({
  origin: "*",
  methods: ["GET", "POST"]
}));

// ⚠️ multer routes first
app.use("/api", resumeRoutes);

// JSON parser after multer routes
app.use(express.json());

app.get("/", (req, res) => {
  res.send("🚀 HireRank AI Backend Running");
});

// ✅ IMPORTANT: Render needs dynamic PORT
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});