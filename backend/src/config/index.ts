/**
 * Configurações centralizadas da aplicação
 */

export const config = {
  // Servidor
  port: process.env.PORT || 5000,

  // APIs Externas
  stac: {
    baseUrl: 'https://data.inpe.br/bdc/stac/v1',
  },
  
  wtss: {
    baseUrl: 'https://data.inpe.br/bdc/wtss/v4',
  },

  // Coleções/Coverages padrão (nomes corretos WTSS - case sensitive!)
  defaultCollections: ['S2_L2A', 'LANDSAT-16D-1', 'mod13q1-6.1'], // STAC
  defaultCoverages: ['mod13q1-6.1', 'S2-16D-2', 'LANDSAT-16D-1'], // WTSS (minúsculo!)

  // Parâmetros padrão
  defaults: {
    startDate: '2024-01-01',
    endDate: '2024-10-06',
    variable: 'NDVI',
    bboxDelta: 0.01, // ~1km
    maxResults: 20,
    // Parâmetros específicos para o fluxo STAC
    itemsLimit: 20,
    maxItemsLimit: 100,
    // Bbox padrão (Brasil aproximado)
    defaultBbox: [-74.0, -34.0, -34.0, 5.0]
  },

  // Coleções principais do INPE STAC
  mainCollections: {
    sentinel2: 'S2_L2A-1',
    landsat8: 'LC8_L1-1', 
    cbers4: 'CBERS4_MUX_L4-1',
    modis: 'MOD13Q1-6.1'
  },
};
