import type { SatelliteOption } from "./types";

export const satelliteOptions: SatelliteOption[] = [
  {
    value: "S2-16D-2",
    label: "Sentinel-2 (10m)",
    description: "Alta resolução, revisita 5 dias",
  },
  {
    value: "LANDSAT-16D-1",
    label: "Landsat-8 (30m)",
    description: "Resolução média, revisita 16 dias",
  },
  {
    value: "mod13q1-6.1",
    label: "MODIS Terra - Vegetação (250m)",
    description: "Baixa resolução, revisita diária",
  },
  {
    value: "myd13q1-6.1",
    label: "MODIS Aqua - Vegetação (250m)",
    description: "Baixa resolução, revisita diária",
  },
  {
    value: "mod11a2-6.1",
    label: "MODIS Terra - Temperatura (1km)",
    description: "Temperatura de superfície (LST)",
  },
  {
    value: "myd11a2-6.1",
    label: "MODIS Aqua - Temperatura (1km)",
    description: "Temperatura de superfície (LST)",
  },
  {
    value: "CBERS4-MUX-2M-1",
    label: "CBERS-4 MUX (20m)",
    description: "Satélite sino-brasileiro",
  },
  {
    value: "CBERS4-WFI-16D-2",
    label: "CBERS-4 WFI (64m)",
    description: "Campo de visão amplo",
  },
  {
    value: "CBERS-WFI-8D-1",
    label: "CBERS WFI (64m)",
    description: "Revisita 8 dias",
  },
];

export const satelliteVariables: { [key: string]: string[] } = {
  "S2-16D-2": ["NDVI", "EVI", "NDWI"],
  "LANDSAT-16D-1": ["NDVI", "EVI", "NDWI"],
  "mod13q1-6.1": ["NDVI", "EVI"],
  "myd13q1-6.1": ["NDVI", "EVI"],
  "mod11a2-6.1": ["LST_Day_1km", "LST_Night_1km"],
  "myd11a2-6.1": ["LST_Day_1km", "LST_Night_1km"],
  "CBERS4-MUX-2M-1": ["NDVI"],
  "CBERS4-WFI-16D-2": ["NDVI"],
  "CBERS-WFI-8D-1": ["NDVI"],
};

export const variableColors: Record<string, string> = {
  // Índices
  NDVI: "#4caf50",
  EVI: "#00bcd4",

  // Sentinel-2 Bands
  BAND5: "#2196f3", // Blue
  BAND6: "#4caf50", // Green
  BAND7: "#f44336", // Red
  BAND8: "#9c27b0", // NIR

  // Landsat Bands
  BAND2: "#2196f3", // Blue
  BAND3: "#4caf50", // Green
  BAND4: "#f44336", // Red

  // MODIS Bands
  blue: "#2196f3",
  red: "#f44336",
  nir: "#9c27b0",
  mir: "#ff9800",
};

export const variableLabels: Record<string, string> = {
  // Índices
  NDVI: "NDVI",
  EVI: "EVI",

  // Sentinel-2
  BAND5: "Azul (B5)",
  BAND6: "Verde (B6)",
  BAND7: "Vermelho (B7)",
  BAND8: "NIR (B8)",

  // Landsat
  BAND2: "Azul (B2)",
  BAND3: "Verde (B3)",
  BAND4: "Vermelho (B4)",

  // MODIS
  blue: "Azul",
  red: "Vermelho",
  nir: "NIR",
  mir: "MIR",
};

export const DEFAULT_FILTERS = {
  satellite: "S2-16D-2",
  variable: "NDVI",
  startDate: "2024-01-01",
  endDate: "2024-10-01",
};
