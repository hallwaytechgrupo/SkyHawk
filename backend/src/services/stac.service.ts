/**
 * Serviço para interagir com a API STAC do INPE
 */

import axios from 'axios';
import { config } from '../config';
import { Collection, SearchResult } from '../types';

const STAC_BASE_URL = config.stac.baseUrl;

/**
 * Busca todas as coleções disponíveis na API STAC
 */
export async function getCollections(): Promise<Collection[]> {
  try {
    const res = await axios.get(`${STAC_BASE_URL}/collections`);
    const collections = res.data.collections;

    const relevant = collections.filter((c: any) => 
      c.id.includes('S2_L2A') || 
      c.id.includes('LANDSAT-16D') || 
      c.id.includes('mod13q1-6.1')
    );

    return relevant.map((c: any): Collection => ({
      id: c.id,
      title: c.title,
      spatialResolution: c.summaries?.gsd?.min || '10m',
      temporalResolution: '5-16 dias',
      variables: ['NDVI', 'EVI'],
    }));
  } catch (error) {
    console.error('Erro ao buscar coleções STAC:', error);
    
    // Fallback com coleções hardcoded
    return [
      { 
        id: 'S2_L2A', 
        title: 'Sentinel-2', 
        spatialResolution: '10m', 
        temporalResolution: '5 dias', 
        variables: ['NDVI', 'EVI'] 
      },
      { 
        id: 'LANDSAT-16D-1', 
        title: 'Landsat-8', 
        spatialResolution: '30m', 
        temporalResolution: '16 dias', 
        variables: ['NDVI', 'LST'] 
      },
      { 
        id: 'mod13q1-6.1', 
        title: 'MODIS', 
        spatialResolution: '250m', 
        temporalResolution: '16 dias', 
        variables: ['NDVI', 'EVI'] 
      }
    ];
  }
}

/**
 * Busca imagens de satélite por ponto geográfico
 */
export async function searchItemsByPoint(
  lat: number,
  lng: number,
  collections?: string[],
  startDate?: string,
  endDate?: string,
  maxCloudCover?: number
): Promise<SearchResult> {
  const delta = config.defaults.bboxDelta;
  const bbox: [number, number, number, number] = [
    lng - delta, 
    lat - delta, 
    lng + delta, 
    lat + delta
  ];

  console.log(`STAC bbox para (${lat}, ${lng}): [${bbox.join(', ')}]`);

  const payload: any = {
    bbox,
    collections: collections || config.defaultCollections,
    datetime: `${startDate || config.defaults.startDate}/${endDate || config.defaults.endDate}`,
    limit: config.defaults.maxResults,
    sortby: [{ field: { datetime: 'desc' } }],
    fields: [
      'id', 
      'properties.datetime', 
      'properties.eo:cloud_cover', 
      'properties.collection', 
      'assets'
    ]
  };

  if (maxCloudCover) {
    payload.query = { 'eo:cloud_cover': { lt: maxCloudCover } };
  }

  try {
    const res = await axios.post(`${STAC_BASE_URL}/search`, payload);
    console.log(`STAC retornou ${res.data.features?.length || 0} itens`);
    
    return { features: res.data.features || [] };
  } catch (error) {
    console.error('Erro ao buscar itens STAC:', error);
    return { features: [] };
  }
}
