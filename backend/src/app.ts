/**
 * SkyHawk - API de Monitoramento por Satélite
 */

import express from "express";
import cors from "cors";
import { config } from "./config";
import routes from "./routes";

const app = express();

// Middlewares
app.use(
  cors({
    origin: ["http://localhost:5173", "http://localhost:3000"],
    credentials: true,
  })
);
app.use(express.json());

// Log
app.use((req, res, next) => {
  console.log(`📨 ${req.method} ${req.path}`);
  next();
});

// Rota raiz
app.get("/", (req, res) => {
  res.json({
    message: "🛰️ SkyHawk API",
    version: "1.0.0",
    status: "online",
    endpoints: {
      health: "/api/health",
      timeSeries: "/api/time-series",
      satellites: "/api/satellites",
    },
  });
});

// Rotas com prefixo /api
app.use("/api", routes);

// Handler de erros
app.use(
  (
    err: any,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    console.error("❌ Erro:", err);
    res.status(500).json({
      error: err.message || "Erro interno",
    });
  }
);

// 404
app.use((req, res) => {
  res.status(404).json({
    error: "Rota não encontrada",
    path: req.path,
  });
});

export default app;
