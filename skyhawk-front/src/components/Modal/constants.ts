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

export const variableColors: { [key: string]: string } = {
  NDVI: "#00a86b",
  EVI: "#00c896",
  NDWI: "#0077b6",
  LST_Day_1km: "#ff6347",
  LST_Night_1km: "#ff8c69",
};

export const variableLabels: { [key: string]: string } = {
  NDVI: "NDVI - Índice de Vegetação",
  EVI: "EVI - Vegetação Melhorada",
  NDWI: "NDWI - Índice de Água",
  LST_Day_1km: "LST - Temperatura Diurna",
  LST_Night_1km: "LST - Temperatura Noturna",
};

export const DEFAULT_FILTERS = {
  satellite: "S2-16D-2",
  variable: "NDVI",
  startDate: "2024-01-01",
  endDate: "2024-10-01",
};
