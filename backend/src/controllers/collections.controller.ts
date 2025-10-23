/**
 * Controller para gerenciar coleções de satélites (apenas consultas GET)
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
    res.status(500).json({ 
      success: false,
      error: 'Erro ao buscar coleções' 
    });
  }
}

/**
 * GET /api/point?lat=-23.3&lng=-45.96&startDate=2024-01-01&endDate=2024-10-06
 * Busca coleções e imagens disponíveis para um ponto
 */
export async function getPointData(req: Request, res: Response): Promise<void> {
  const { lat, lng, startDate, endDate } = req.query;

  if (!lat || !lng) {
    res.status(400).json({ 
      success: false,
      error: 'Parâmetros lat e lng são obrigatórios' 
    });
    return;
  }

  try {
    const numLat = parseFloat(lat as string);
    const numLng = parseFloat(lng as string);

    const [collections, items] = await Promise.all([
      stacService.getCollections(),
      stacService.searchItemsByPoint(
        numLat, 
        numLng, 
        undefined, 
        startDate as string, 
        endDate as string
      )
    ]);

    res.json({
      success: true,
      point: { lat: numLat, lng: numLng },
      collections,
      availableItems: items.features,
      source: 'INPE STAC v1'
    });
  } catch (error) {
    console.error('Erro em getPointData:', error);
    res.status(500).json({ 
      success: false,
      error: 'Erro ao buscar dados do ponto' 
    });
  }
}

/**
 * GET /api/search?lat=-23.3&lng=-45.96&collections=S2_L2A,LANDSAT&maxCloud=10&startDate=2024-01-01&endDate=2024-10-06
 * Busca imagens com filtros avançados
 */
export async function searchImages(req: Request, res: Response): Promise<void> {
  const { lat, lng, collections, variable, startDate, endDate, maxCloud } = req.query;

  if (!lat || !lng) {
    res.status(400).json({ 
      success: false,
      error: 'Parâmetros lat e lng são obrigatórios' 
    });
    return;
  }

  try {
    const numLat = parseFloat(lat as string);
    const numLng = parseFloat(lng as string);
    const numMaxCloud = maxCloud ? parseFloat(maxCloud as string) : undefined;
    const parsedCollections = collections ? (collections as string).split(',') : undefined;

    const items = await stacService.searchItemsByPoint(
      numLat, 
      numLng, 
      parsedCollections, 
      startDate as string, 
      endDate as string, 
      numMaxCloud
    );

    res.json({
      success: true,
      searchParams: { 
        point: { lat: numLat, lng: numLng },
        collections: parsedCollections, 
        variable, 
        period: `${startDate}/${endDate}`,
        maxCloudCover: numMaxCloud
      },
      filteredItems: items.features,
      total: items.features.length,
      source: 'INPE STAC v1'
    });
  } catch (error) {
    console.error('Erro em searchImages:', error);
    res.status(500).json({ 
      success: false,
      error: 'Erro ao buscar imagens' 
    });
  }
}

// ===== ENDPOINTS PARA O FLUXO STAC DO INPE =====

/**
 * GET /api/catalog
 * Retorna o catálogo principal STAC
 */
export async function getCatalog(req: Request, res: Response): Promise<void> {
  try {
    const catalog = await stacService.getCatalog();
    
    res.json({
      success: true,
      catalog,
      source: 'INPE STAC v1'
    });
  } catch (error) {
    console.error('Erro ao buscar catálogo:', error);
    res.status(500).json({ 
      success: false,
      error: 'Erro ao buscar catálogo STAC' 
    });
  }
}

/**
 * GET /api/collections/cards
 * Retorna todas as coleções formatadas como cards
 */
export async function getCollectionCards(req: Request, res: Response): Promise<void> {
  try {
    const cards = await stacService.getCollectionCards();
    
    res.json({
      success: true,
      collections: cards,
      total: cards.length,
      source: 'INPE STAC v1'
    });
  } catch (error) {
    console.error('Erro ao buscar coleções:', error);
    res.status(500).json({ 
      success: false,
      error: 'Erro ao buscar coleções' 
    });
  }
}

/**
 * GET /api/collections/:id/details
 * Retorna detalhes completos de uma coleção
 */
export async function getCollectionDetails(req: Request, res: Response): Promise<void> {
  const { id } = req.params;
  
  try {
    const collection = await stacService.getStacCollection(id);
    
    res.json({
      success: true,
      collection,
      source: 'INPE STAC v1'
    });
  } catch (error) {
    console.error(`Erro ao buscar coleção ${id}:`, error);
    res.status(404).json({ 
      success: false,
      error: `Coleção ${id} não encontrada` 
    });
  }
}

/**
 * GET /api/collections/:id/items?limit=20&bbox=-47,-24,-46,-23
 * Retorna itens da coleção formatados como cards
 */
export async function getCollectionItemCards(req: Request, res: Response): Promise<void> {
  const { id } = req.params;
  const { limit = '20', bbox } = req.query;
  
  try {
    const parsedLimit = parseInt(limit as string);
    const parsedBbox = bbox ? (bbox as string).split(',').map(Number) : undefined;
    
    const items = await stacService.getItemCards(id, parsedLimit, parsedBbox);
    
    res.json({
      success: true,
      collectionId: id,
      searchParams: {
        limit: parsedLimit,
        bbox: parsedBbox
      },
      items,
      total: items.length,
      source: 'INPE STAC v1'
    });
  } catch (error) {
    console.error(`Erro ao buscar itens da coleção ${id}:`, error);
    res.status(500).json({ 
      success: false,
      error: `Erro ao buscar itens da coleção ${id}` 
    });
  }
}

/**
 * GET /api/collections/:id/search?bbox=-47,-24,-46,-23&limit=50
 * Busca itens por área de interesse
 */
export async function searchCollectionItems(req: Request, res: Response): Promise<void> {
  const { id } = req.params;
  const { bbox, limit = '50' } = req.query;
  
  if (!bbox) {
    res.status(400).json({ 
      success: false,
      error: 'Parâmetro bbox é obrigatório no formato: west,south,east,north' 
    });
    return;
  }
  
  try {
    const parsedBbox = (bbox as string).split(',').map(Number);
    
    if (parsedBbox.length !== 4) {
      res.status(400).json({ 
        success: false,
        error: 'bbox deve conter exatamente 4 coordenadas: west,south,east,north' 
      });
      return;
    }
    
    const parsedLimit = parseInt(limit as string);
    const items = await stacService.searchItemsByBbox(id, parsedBbox, parsedLimit);
    
    res.json({
      success: true,
      collectionId: id,
      searchParams: {
        bbox: parsedBbox,
        limit: parsedLimit
      },
      items,
      total: items.length,
      source: 'INPE STAC v1'
    });
  } catch (error) {
    console.error(`Erro na busca por área na coleção ${id}:`, error);
    res.status(500).json({ 
      success: false,
      error: 'Erro na busca por área' 
    });
  }
}
