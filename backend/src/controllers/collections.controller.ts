/**
 * Controller para gerenciar coleções de satélites
 */

import { Request, Response } from 'express';
import * as stacService from '../services/stac.service';

/**
 * GET /api/collections
 * Retorna todas as coleções disponíveis
 */
export async function getAllCollections(req: Request, res: Response): Promise<void> {
  try {
    const collections = await stacService.getCollections();
    
    res.json({
      success: true,
      collections,
      source: 'INPE STAC v1'
    });
  } catch (error) {
    console.error('Erro em getAllCollections:', error);
    res.status(500).json({ error: 'Erro ao buscar coleções' });
  }
}

/**
 * POST /api/point
 * Busca coleções e imagens disponíveis para um ponto
 */
export async function getPointData(req: Request, res: Response): Promise<void> {
  const { lat, lng, startDate, endDate } = req.body;

  if (!lat || !lng) {
    res.status(400).json({ error: 'Latitude e longitude são obrigatórios' });
    return;
  }

  try {
    const [collections, items] = await Promise.all([
      stacService.getCollections(),
      stacService.searchItemsByPoint(lat, lng, undefined, startDate, endDate)
    ]);

    res.json({
      success: true,
      collections,
      availableItems: items.features,
      source: 'INPE STAC v1'
    });
  } catch (error) {
    console.error('Erro em getPointData:', error);
    res.status(500).json({ error: 'Erro ao buscar dados do ponto' });
  }
}

/**
 * POST /api/search
 * Busca imagens com filtros avançados
 */
export async function searchImages(req: Request, res: Response): Promise<void> {
  const { lat, lng, collections, variable, startDate, endDate, maxCloud } = req.body;

  if (!lat || !lng) {
    res.status(400).json({ error: 'Latitude e longitude são obrigatórios' });
    return;
  }

  try {
    const items = await stacService.searchItemsByPoint(
      lat, 
      lng, 
      collections, 
      startDate, 
      endDate, 
      maxCloud
    );

    res.json({
      success: true,
      filteredItems: items.features,
      filtersApplied: { collections, variable, startDate, endDate, maxCloud },
      source: 'INPE STAC v1'
    });
  } catch (error) {
    console.error('Erro em searchImages:', error);
    res.status(500).json({ error: 'Erro ao buscar imagens' });
  }
}
