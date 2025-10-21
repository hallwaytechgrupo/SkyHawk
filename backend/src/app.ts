/**
 * SkyHawk - API de Monitoramento por Satélite
 * Backend para consulta de séries temporais de dados de satélite (STAC + WTSS)
 */

import express from "express";
import cors from "cors";
import { config } from "./config";
import routes from "./routes";

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Rotas
app.use(routes);

// Inicialização do servidor
app.listen(config.port, () => {
  console.log(`🚀 SkyHawk Backend rodando em http://localhost:${config.port}`);
  console.log(`📡 Conectado às APIs INPE (STAC + WTSS)`);
  console.log(`\n💡 Teste rápido:`);
  console.log(`   POST http://localhost:${config.port}/api/time-series`);
  console.log(
    `   Body: { "lat": -23.3, "lng": -45.96, "startDate": "2024-01-01" }\n`
  );
});

export default app;
