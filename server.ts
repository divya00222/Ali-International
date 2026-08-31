import express from "express";
import path from "path";

const app = express();
const PORT = 3000;

// Serve static files from root directory
app.use(express.static(path.join(process.cwd())));

app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

// Fallback routing for multi-page html
app.get("*", (req, res) => {
  let reqPath = req.path;
  if (reqPath === "/") reqPath = "/index.html";
  if (!reqPath.endsWith(".html") && !reqPath.includes(".")) {
    reqPath += ".html";
  }
  const filePath = path.join(process.cwd(), reqPath);
  res.sendFile(filePath, (err) => {
    if (err) {
      res.sendFile(path.join(process.cwd(), "index.html"));
    }
  });
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
