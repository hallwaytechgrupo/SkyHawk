/**
 * Agregador de rotas da aplicação
 */

import { Router } from "express";
import timeseriesRoutes from "./timeseries.routes";
import collectionsRoutes from "./collections.routes";

const router = Router();

// ✅ REMOVER O PREFIXO /api DAQUI (já está no app.ts)
// ❌ ANTES: router.use("/api", timeseriesRoutes);
// ✅ AGORA:
router.use(timeseriesRoutes);
router.use(collectionsRoutes);

// ✅ ROTA DE HEALTH CHECK (sem /api)
router.get("/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    timestamp: new Date().toISOString(),
    service: "skyhawk-api",
    version: "1.0.0",
    uptime: process.uptime(),
  });
});

// ✅ ROTA RAIZ DA API
router.get("/", (req, res) => {
  res.json({
    message: "SkyHawk API",
    version: "1.0.0",
    status: "online",
    endpoints: {
      health: "/api/health",
      timeSeries: "/api/time-series",
      satellites: "/api/satellites",
      collections: "/api/collections",
    },
  });
});

export default router;
