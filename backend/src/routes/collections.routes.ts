/**
 * Rotas para navegação nas coleções STAC (apenas consultas GET)
 */

import { Router } from 'express';
import * as collectionsController from '../controllers/collections.controller';

const router = Router();

// ===== ROTAS EXISTENTES CONVERTIDAS PARA GET =====
// GET /api/collections - Lista todas as coleções
router.get('/collections', collectionsController.getAllCollections);

// GET /api/point - Buscar dados de um ponto via query params
router.get('/point', collectionsController.getPointData);

// GET /api/search - Buscar imagens com filtros via query params
router.get('/search', collectionsController.searchImages);

// ===== ROTAS PARA FLUXO STAC DO INPE (apenas GET) =====
// GET /api/catalog - Catálogo principal STAC
router.get('/catalog', collectionsController.getCatalog);

// GET /api/collections/cards - Lista todas as coleções como cards
router.get('/collections/cards', collectionsController.getCollectionCards);

// GET /api/collections/:id/details - Detalhes de uma coleção específica
router.get('/collections/:id/details', collectionsController.getCollectionDetails);

// GET /api/collections/:id/items - Itens de uma coleção como cards
router.get('/collections/:id/items', collectionsController.getCollectionItemCards);

// GET /api/collections/:id/search - Busca itens por área via query params
router.get('/collections/:id/search', collectionsController.searchCollectionItems);

export default router;
