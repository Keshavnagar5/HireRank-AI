const express = require("express");
const cors = require("cors");

const resumeRoutes = require("./routes/resumeRoutes");

const app = express();

app.use(cors());

// ⚠️ IMPORTANT — multer must run before express.json interferes
app.use("/api", resumeRoutes);

app.use(express.json());

app.get("/", (req, res) => {
  res.send("🚀 HireRank AI Backend Running");
});

const PORT = 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});