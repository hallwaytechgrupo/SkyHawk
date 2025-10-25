import type { TimeSeriesData } from "../../services/skyHawkService";

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: TimeSeriesData | null;
  coordinates: { lat: number; lng: number } | null;
  loading: boolean;
  error: string | null;
  onFiltersChange: (filters: FilterParams) => void;
}

export interface FilterParams {
  satellite: string;
  variable: string;
  startDate: string;
  endDate: string;
}

export interface MultiSeriesData {
  [variable: string]: TimeSeriesData;
}

export interface LocationInfo {
  city: string;
  state?: string;
  country: string;
  loading: boolean;
}

export interface SatelliteOption {
  value: string;
  label: string;
  description: string;
}

export interface VariableOption {
  value: string;
  label: string;
  satellites: string[];
}

export interface ChartDataPoint {
  date: string;
  value: number;
  fullDate: string;
  isAnomaly?: boolean;
}

export interface Anomaly {
  value: number;
  index: number;
  reason: string;
}

export interface Statistics {
  avg: number;
  min: number;
  max: number;
  stdDev: number;
  count: number;
  total: number;
  validPercentage: number;
}

export interface ModalHeaderProps {
  satellite: string;
  validCount: number;
  totalCount: number;
  showFilters: boolean;
  onToggleFilters: () => void;
  onClose: () => void;
}
