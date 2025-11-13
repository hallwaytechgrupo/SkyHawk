import app from "./app";

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log("");
  console.log("🚀 ====================================");
  console.log(`🌍 Server running on http://localhost:${PORT}`);
  console.log("📡 API Endpoints:");
  console.log(`   GET  http://localhost:${PORT}/`);
  console.log(`   GET  http://localhost:${PORT}/api/health`);
  console.log(`   POST http://localhost:${PORT}/api/time-series`);
  console.log("🚀 ====================================");
  console.log("");
});

export default app;
