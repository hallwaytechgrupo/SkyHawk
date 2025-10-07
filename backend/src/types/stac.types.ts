/**
 * Tipos relacionados à API STAC
 */

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
