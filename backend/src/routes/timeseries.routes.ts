/**
 * Rotas para séries temporais (apenas consultas GET)
 */

import { Router } from 'express';
import * as timeseriesController from '../controllers/timeseries.controller';

const router = Router();

// GET /api/time-series - Obter série temporal via query params
router.get('/time-series', timeseriesController.getTimeSeries);

// GET /api/compare - Comparar múltiplas séries via query params
router.get('/compare', timeseriesController.compareTimeSeries);

// GET /api/export - Exportar dados
router.get('/export', timeseriesController.exportData);

// GET /api/satellites - Listar satélites disponíveis
router.get('/satellites', timeseriesController.listSatellites);

// GET /api/satellite/:name/info - Info de um satélite específico
router.get('/satellite/:name/info', timeseriesController.getSatelliteInfo);

export default router;
