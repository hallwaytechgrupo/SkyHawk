/**
 * Controller para gerenciar séries temporais (apenas consultas GET)
 */

import { Request, Response } from 'express';
import { config } from '../config';
import * as wtssService from '../services/wtss.service';
import * as stacService from '../services/stac.service';

/**
 * GET /api/time-series?lat=-23.3&lng=-45.96&collection=mod13q1-6.1&variable=NDVI&startDate=2024-01-01&endDate=2024-10-06
 * Retorna série temporal de NDVI para um ponto
 */
export async function getTimeSeries(req: Request, res: Response): Promise<void> {
  const { lat, lng, collection, variable, startDate, endDate } = req.query;

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
    const coverage = collection as string || 'mod13q1-6.1';
    const attributes = [variable as string || config.defaults.variable];
    
    const series = await wtssService.getTimeSeries(
      numLat,
      numLng,
      coverage,
      attributes,
      startDate as string || config.defaults.startDate,
      endDate as string || config.defaults.endDate
    );

    res.json({
      success: true,
      searchParams: {
        point: { lat: numLat, lng: numLng },
        collection: coverage,
        variable: attributes[0],
        period: `${startDate || config.defaults.startDate}/${endDate || config.defaults.endDate}`
      },
      data: series,
      source: 'INPE WTSS v4'
    });
  } catch (error) {
    console.error('Erro em getTimeSeries:', error);
    res.status(500).json({ 
      success: false,
      error: 'Erro ao buscar série temporal' 
    });
  }
}

/**
 * GET /api/compare?lat=-23.3&lng=-45.96&collections=mod13q1-6.1,S2-16D-2&variable=NDVI&startDate=2024-01-01&endDate=2024-10-06
 * Compara séries temporais de múltiplos satélites
 */
export async function compareTimeSeries(req: Request, res: Response): Promise<void> {
  const { lat, lng, collections, variable, startDate, endDate } = req.query;

  if (!lat || !lng) {
    res.status(400).json({ 
      success: false,
      error: 'Parâmetros lat e lng são obrigatórios' 
    });
    return;
  }

  if (!collections) {
    res.status(400).json({ 
      success: false,
      error: 'Parâmetro collections é obrigatório (separados por vírgula)' 
    });
    return;
  }

  try {
    const numLat = parseFloat(lat as string);
    const numLng = parseFloat(lng as string);
    const parsedCollections = (collections as string).split(',');
    
    if (parsedCollections.length < 2) {
      res.status(400).json({ 
        success: false,
        error: 'Mínimo de 2 coleções necessário para comparação' 
      });
      return;
    }

    const attributes = [variable as string || config.defaults.variable];
    
    const series = await wtssService.getMultipleTimeSeries(
      numLat,
      numLng,
      parsedCollections,
      attributes,
      startDate as string || config.defaults.startDate,
      endDate as string || config.defaults.endDate
    );

    const alignedSeries = series.map(s => ({
      satellite: s.metadata.collection,
      timeline: s.timeline,
      values: s.values,
      variable: s.metadata.variable
    }));

    res.json({
      success: true,
      searchParams: {
        point: { lat: numLat, lng: numLng },
        collections: parsedCollections,
        variable: attributes[0],
        period: `${startDate || config.defaults.startDate}/${endDate || config.defaults.endDate}`
      },
      comparison: alignedSeries,
      source: 'INPE WTSS v4'
    });
  } catch (error) {
    console.error('Erro em compareTimeSeries:', error);
    res.status(500).json({ 
      success: false,
      error: 'Erro ao comparar séries temporais' 
    });
  }
}

/**
 * GET /api/export?type=csv&collections=mod13q1-6.1,S2-16D-2&variable=NDVI&startDate=2024-01-01&endDate=2024-10-06&lat=-23.3&lng=-45.96
 * Exporta dados em JSON ou CSV
 */
export async function exportData(req: Request, res: Response): Promise<void> {
  const { type = 'json', collections, variable, startDate, endDate, lat, lng } = req.query;

  if (!collections || !lat || !lng) {
    res.status(400).json({ 
      success: false,
      error: 'Parâmetros collections, lat e lng são obrigatórios' 
    });
    return;
  }

  try {
    const numLat = parseFloat(lat as string);
    const numLng = parseFloat(lng as string);
    const parsedCollections = (collections as string).split(',');

    const [items, series] = await Promise.all([
      stacService.searchItemsByPoint(
        numLat, 
        numLng, 
        parsedCollections, 
        startDate as string, 
        endDate as string
      ),
      wtssService.getMultipleTimeSeries(
        numLat,
        numLng,
        parsedCollections,
        [variable as string || config.defaults.variable],
        startDate as string || config.defaults.startDate,
        endDate as string || config.defaults.endDate
      )
    ]);

    const exportData = {
      point: { lat: numLat, lng: numLng },
      filters: { 
        collections: parsedCollections, 
        variable: variable as string, 
        period: `${startDate}/${endDate}` 
      },
      metadados: items.features,
      series,
      exportedAt: new Date().toISOString(),
      source: 'INPE STAC/WTSS - Export'
    };

    if (type === 'json') {
      res.json(exportData);
    } else {
      let csv = 'Satellite,Date,Value\n';
      series.forEach((s: any) => 
        s.timeline.forEach((date: string, i: number) => 
          csv += `${s.metadata.collection},${date},${s.values[i]}\n`
        )
      );
      res.header('Content-Type', 'text/csv');
      res.header('Content-Disposition', 'attachment; filename=export.csv');
      res.send(csv);
    }
  } catch (error) {
    console.error('Erro em exportData:', error);
    res.status(500).json({ 
      success: false,
      error: 'Erro ao exportar dados' 
    });
  }
}

/**
 * GET /api/satellites
 * Lista satélites/coverages disponíveis
 */
export async function listSatellites(req: Request, res: Response): Promise<void> {
  try {
    const coverages = await wtssService.listCoverages();
    
    // Mapeia para nomes amigáveis
    const satellites = coverages.map((cov: string) => {
      let name = cov;
      let description = '';
      
      if (cov === 'mod13q1-6.1') {
        name = 'MODIS Terra';
        description = 'Resolução 250m, revisita 16 dias';
      } else if (cov === 'myd13q1-6.1') {
        name = 'MODIS Aqua';
        description = 'Resolução 250m, revisita 16 dias';
      } else if (cov === 'S2-16D-2') {
        name = 'Sentinel-2';
        description = 'Resolução 10m, revisita 5 dias';
      } else if (cov === 'LANDSAT-16D-1') {
        name = 'Landsat';
        description = 'Resolução 30m, revisita 16 dias';
      }
      
      return { id: cov, name, description };
    });

    res.json({
      success: true,
      satellites,
      total: satellites.length,
      source: 'INPE WTSS v4'
    });
  } catch (error) {
    console.error('Erro em listSatellites:', error);
    res.status(500).json({ 
      success: false,
      error: 'Erro ao listar satélites' 
    });
  }
}

/**
 * GET /api/satellite/:name/info
 * Descreve um satélite específico (variáveis disponíveis, período, etc.)
 */
export async function getSatelliteInfo(req: Request, res: Response): Promise<void> {
  const { name } = req.params;

  try {
    const info = await wtssService.describeCoverage(name);
    
    if (!info) {
      res.status(404).json({ 
        success: false,
        error: `Satélite ${name} não encontrado` 
      });
      return;
    }

    res.json({
      success: true,
      satellite: info,
      source: 'INPE WTSS v4'
    });
  } catch (error) {
    console.error('Erro em getSatelliteInfo:', error);
    res.status(500).json({ 
      success: false,
      error: 'Erro ao buscar informações do satélite' 
    });
  }
}
