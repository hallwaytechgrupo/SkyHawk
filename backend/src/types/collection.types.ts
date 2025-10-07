/**
 * Tipos relacionados a Coleções de Satélite
 */

export interface Collection {
  id: string;
  title: string;
  spatialResolution: string;
  temporalResolution: string;
  variables: string[];
}

export interface CollectionResponse {
  collections: Collection[];
  source: string;
}
