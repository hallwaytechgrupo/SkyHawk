import express from "express";
import cors from "cors";
import routes from "./routes";

const app = express();
const PORT = process.env.PORT || 5000;

// ✅ MIDDLEWARES
app.use(
  cors({
    origin: "http://localhost:5173", // Porta do Vite (frontend)
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ LOGGER MIDDLEWARE
app.use((req, res, next) => {
  console.log(`📡 ${req.method} ${req.path}`);
  next();
});

// ✅ ROTAS
app.use("/", routes);

// ✅ ERROR HANDLER
app.use(
  (
    err: any,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    console.error("❌ Erro:", err);
    res.status(500).json({
      success: false,
      error: err.message || "Erro interno do servidor",
    });
  }
);

// ✅ 404 HANDLER
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: `Rota não encontrada: ${req.method} ${req.path}`,
    availableRoutes: [
      "GET /",
      "POST /api/time-series",
      "POST /api/compare",
      "GET /api/satellites",
      "GET /api/satellite/:name/info",
      "GET /api/export",
    ],
  });
});

// ✅ INICIAR SERVIDOR
app.listen(PORT, () => {
  console.log("");
  console.log("🚀 ====================================");
  console.log(`🌍 Server running on http://localhost:${PORT}`);
  console.log("📡 API Endpoints:");
  console.log(`   GET  http://localhost:${PORT}/`);
  console.log(`   POST http://localhost:${PORT}/api/time-series`);
  console.log(`   POST http://localhost:${PORT}/api/compare`);
  console.log(`   GET  http://localhost:${PORT}/api/satellites`);
  console.log("🚀 ====================================");
  console.log("");
});

export default app;
