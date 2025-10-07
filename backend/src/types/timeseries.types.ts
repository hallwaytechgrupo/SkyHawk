/**
 * Tipos relacionados a Séries Temporais
 */

export interface TimeSeries {
  timeline: string[];
  values: number[];
  metadata: {
    collection: string;
    variable: string;
    resolution: string;
  };
}

export interface TimeSeriesRequest {
  lat: number;
  lng: number;
  collection?: string;
  variable?: string;
  startDate?: string;
  endDate?: string;
}

export interface ComparisonRequest {
  lat: number;
  lng: number;
  collections: string[];
  variable?: string;
  startDate?: string;
  endDate?: string;
}

export interface AlignedTimeSeries {
  satellite: string;
  timeline: string[];
  values: number[];
  variable: string;
}
