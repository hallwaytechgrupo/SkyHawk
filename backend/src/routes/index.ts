/**
 * Agregador de rotas da aplicação
 */

import { Router } from 'express';
import timeseriesRoutes from './timeseries.routes';
import collectionsRoutes from './collections.routes';

const router = Router();

// Prefixo /api para todas as rotas
router.use('/api', timeseriesRoutes);
router.use('/api', collectionsRoutes);

// Rota de health check
router.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

export default router;
