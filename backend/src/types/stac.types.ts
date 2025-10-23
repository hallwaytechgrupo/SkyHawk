/**
 * Tipos relacionados à API STAC
 */

// Tipos existentes para compatibilidade com funcionalidades atuais
export interface StacFeature {
  id: string;
  properties: {
    datetime: string;
    'eo:cloud_cover': number;
    collection: string;
  };
  assets: {
    [key: string]: {
      href: string;
    };
  };
}

export interface SearchResult {
  features: StacFeature[];
}

export interface SearchRequest {
  lat: number;
  lng: number;
  collections?: string[];
  startDate?: string;
  endDate?: string;
  maxCloud?: number;
}

export interface PointRequest {
  lat: number;
  lng: number;
  startDate?: string;
  endDate?: string;
}

// Novos tipos para o fluxo STAC do INPE
export interface StacCatalog {
  id: string;
  description: string;
  stac_version: string;
  links: StacLink[];
}

export interface StacCollection {
  id: string;
  title: string;
  description: string;
  license: string;
  extent: {
    spatial: {
      bbox: number[][];
    };
    temporal: {
      interval: string[][];
    };
  };
  summaries?: {
    [key: string]: any;
  };
  links: StacLink[];
}

export interface StacItem {
  id: string;
  type: string;
  geometry: {
    type: string;
    coordinates: number[][][];
  };
  bbox: number[];
  properties: {
    datetime: string;
    [key: string]: any;
  };
  assets: {
    [key: string]: StacAsset;
  };
  links: StacLink[];
}

export interface StacAsset {
  href: string;
  type?: string;
  title?: string;
  description?: string;
  roles?: string[];
}

export interface StacLink {
  rel: string;
  href: string;
  type?: string;
  title?: string;
}

export interface CollectionCard {
  id: string;
  title: string;
  description: string;
  thumbnail?: string;
  itemCount?: number;
  extent: {
    spatial: string;
    temporal: string;
  };
  downloadOptions: DownloadOption[];
}

export interface DownloadOption {
  type: 'tiff' | 'metadata' | 'preview';
  label: string;
  url: string;
  format: string;
  size?: string;
}

export interface ItemCard {
  id: string;
  title: string;
  date: string;
  thumbnail?: string;
  bbox: number[];
  assets: {
    preview?: string;
    data: DownloadOption[];
    metadata: DownloadOption[];
  };
}
