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
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    service: 'SkyHawk API - Consulta de Dados'
  });
});

// Rota raiz com informações da API
router.get('/', (req, res) => {
  res.json({
    name: 'SkyHawk API',
    version: '1.0.0',
    description: 'API para consulta de dados de satélite via STAC e séries temporais (apenas GET)',
    endpoints: {
      // Health & Info
      health: 'GET /health',
      info: 'GET /',
      
      // Satélites & Séries Temporais
      satellites: 'GET /api/satellites',
      satellite_info: 'GET /api/satellite/{name}/info',
      timeseries: 'GET /api/time-series?lat={lat}&lng={lng}&collection={id}&variable={var}&startDate={start}&endDate={end}',
      compare: 'GET /api/compare?lat={lat}&lng={lng}&collections={id1,id2}&variable={var}&startDate={start}&endDate={end}',
      export: 'GET /api/export?type={json|csv}&lat={lat}&lng={lng}&collections={ids}&variable={var}&startDate={start}&endDate={end}',
      
      // STAC - Navegação de Coleções
      catalog: 'GET /api/catalog',
      collections: 'GET /api/collections',
      collections_cards: 'GET /api/collections/cards',
      collection_details: 'GET /api/collections/{id}/details',
      collection_items: 'GET /api/collections/{id}/items?limit={n}&bbox={west,south,east,north}',
      search_items: 'GET /api/collections/{id}/search?bbox={west,south,east,north}&limit={n}',
      
      // STAC - Consultas por Ponto
      point_data: 'GET /api/point?lat={lat}&lng={lng}&startDate={start}&endDate={end}',
      search_images: 'GET /api/search?lat={lat}&lng={lng}&collections={ids}&maxCloud={n}&startDate={start}&endDate={end}'
    },
    examples: {
      timeseries: 'GET /api/time-series?lat=-23.3&lng=-45.96&collection=mod13q1-6.1&variable=NDVI&startDate=2024-01-01&endDate=2024-10-06',
      compare: 'GET /api/compare?lat=-23.3&lng=-45.96&collections=mod13q1-6.1,S2-16D-2&variable=NDVI&startDate=2024-01-01&endDate=2024-10-06',
      point_search: 'GET /api/point?lat=-23.3&lng=-45.96&startDate=2024-01-01&endDate=2024-10-06',
      area_search: 'GET /api/collections/S2_L2A-1/search?bbox=-47,-24,-46,-23&limit=20'
    },
    note: 'Todos os endpoints são GET - API somente para consulta de dados'
  });
});

export default router;
