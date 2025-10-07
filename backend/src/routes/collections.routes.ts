/**
 * Rotas para coleções de satélites
 */

import { Router } from 'express';
import * as collectionsController from '../controllers/collections.controller';

const router = Router();

// GET /api/collections - Listar todas as coleções
router.get('/collections', collectionsController.getAllCollections);

// POST /api/point - Buscar dados de um ponto
router.post('/point', collectionsController.getPointData);

// POST /api/search - Buscar imagens com filtros
router.post('/search', collectionsController.searchImages);

export default router;
