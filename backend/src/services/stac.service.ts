/**
 * Serviço para interagir com a API STAC do INPE
 */

import axios from 'axios';
import { config } from '../config';
import { 
  Collection, 
  SearchResult, 
  StacCatalog, 
  StacCollection, 
  StacItem, 
  CollectionCard, 
  ItemCard, 
  DownloadOption 
} from '../types';

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

// ===== NOVAS FUNÇÕES PARA O FLUXO STAC DO INPE =====

/**
 * Obtém o catálogo principal STAC
 */
export async function getCatalog(): Promise<StacCatalog> {
  try {
    const response = await axios.get(`${STAC_BASE_URL}/`);
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar catálogo STAC:', error);
    throw new Error('Erro ao acessar catálogo STAC');
  }
}

/**
 * Lista todas as coleções disponíveis (versão completa)
 */
export async function getStacCollections(): Promise<StacCollection[]> {
  try {
    const response = await axios.get(`${STAC_BASE_URL}/collections`);
    return response.data.collections || [];
  } catch (error) {
    console.error('Erro ao buscar coleções STAC:', error);
    return [];
  }
}

/**
 * Obtém detalhes de uma coleção específica
 */
export async function getStacCollection(collectionId: string): Promise<StacCollection> {
  try {
    const response = await axios.get(`${STAC_BASE_URL}/collections/${collectionId}`);
    return response.data;
  } catch (error) {
    console.error(`Erro ao buscar coleção ${collectionId}:`, error);
    throw new Error(`Coleção ${collectionId} não encontrada`);
  }
}

/**
 * Lista itens de uma coleção
 */
export async function getCollectionItems(
  collectionId: string, 
  limit: number = 50,
  bbox?: number[]
): Promise<StacItem[]> {
  try {
    const params: any = { limit };
    if (bbox) {
      params.bbox = bbox.join(',');
    }

    const response = await axios.get(`${STAC_BASE_URL}/collections/${collectionId}/items`, {
      params
    });
    return response.data.features || [];
  } catch (error) {
    console.error(`Erro ao buscar itens da coleção ${collectionId}:`, error);
    return [];
  }
}

/**
 * Transforma coleções em cards para o frontend
 */
export async function getCollectionCards(): Promise<CollectionCard[]> {
  const collections = await getStacCollections();
  
  return collections.map(collection => {
    // Extrai informações da extent
    const spatialExtent = collection.extent?.spatial?.bbox?.[0] || [];
    const temporalExtent = collection.extent?.temporal?.interval?.[0] || [];
    
    // Determina opções de download baseado no tipo de coleção
    const downloadOptions: DownloadOption[] = [
      {
        type: 'tiff',
        label: 'Imagens GeoTIFF',
        url: `${STAC_BASE_URL}/collections/${collection.id}/items`,
        format: 'GeoTIFF'
      },
      {
        type: 'metadata',
        label: 'Metadados JSON',
        url: `${STAC_BASE_URL}/collections/${collection.id}`,
        format: 'JSON'
      }
    ];

    return {
      id: collection.id,
      title: collection.title,
      description: collection.description,
      extent: {
        spatial: spatialExtent.length > 0 ? 
          `${spatialExtent[0]?.toFixed(2)}, ${spatialExtent[1]?.toFixed(2)} - ${spatialExtent[2]?.toFixed(2)}, ${spatialExtent[3]?.toFixed(2)}` : 
          'Global',
        temporal: temporalExtent.length > 0 ? 
          `${temporalExtent[0]} - ${temporalExtent[1] || 'presente'}` : 
          'Indefinido'
      },
      downloadOptions
    };
  });
}

/**
 * Transforma itens de coleção em cards para o frontend
 */
export async function getItemCards(
  collectionId: string, 
  limit: number = 20,
  bbox?: number[]
): Promise<ItemCard[]> {
  const items = await getCollectionItems(collectionId, limit, bbox);
  
  return items.map(item => {
    // Extrai opções de download dos assets
    const dataAssets: DownloadOption[] = [];
    const metadataAssets: DownloadOption[] = [];
    let previewUrl: string | undefined;

    Object.entries(item.assets).forEach(([key, asset]) => {
      if (asset.roles?.includes('thumbnail') || key.toLowerCase().includes('thumbnail')) {
        previewUrl = asset.href;
      } else if (asset.href.endsWith('.tif') || asset.href.endsWith('.tiff')) {
        dataAssets.push({
          type: 'tiff',
          label: asset.title || key,
          url: asset.href,
          format: 'GeoTIFF'
        });
      } else if (asset.href.endsWith('.json') || asset.type?.includes('json')) {
        metadataAssets.push({
          type: 'metadata',
          label: asset.title || key,
          url: asset.href,
          format: 'JSON'
        });
      }
    });

    return {
      id: item.id,
      title: item.id,
      date: item.properties.datetime || 'Data não disponível',
      bbox: item.bbox,
      thumbnail: previewUrl,
      assets: {
        preview: previewUrl,
        data: dataAssets,
        metadata: metadataAssets
      }
    };
  });
}

/**
 * Busca itens por área de interesse (bbox)
 */
export async function searchItemsByBbox(
  collectionId: string,
  bbox: number[],
  limit: number = 50
): Promise<ItemCard[]> {
  return getItemCards(collectionId, limit, bbox);
}
