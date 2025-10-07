/**
 * Rotas para séries temporais
 */

import { Router } from 'express';
import * as timeseriesController from '../controllers/timeseries.controller';

const router = Router();

// POST /api/time-series - Obter série temporal
router.post('/time-series', timeseriesController.getTimeSeries);

// POST /api/compare - Comparar múltiplas séries
router.post('/compare', timeseriesController.compareTimeSeries);

// GET /api/export - Exportar dados
router.get('/export', timeseriesController.exportData);

// GET /api/satellites - Listar satélites disponíveis
router.get('/satellites', timeseriesController.listSatellites);

// GET /api/satellite/:name/info - Info de um satélite específico
router.get('/satellite/:name/info', timeseriesController.getSatelliteInfo);

export default router;
