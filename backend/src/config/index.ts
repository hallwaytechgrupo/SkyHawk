/**
 * Configurações centralizadas da aplicação
 */

// ✅ TIPOS PARA TIPAGEM FORTE
interface BandMetadata {
  common_name: string;
  scale: number;
  nodata: number;
  data_type: string;
  resolution: number;
  min_value: number;
  max_value: number;
}

interface AvailableBands {
  spectral: string[];
  indices: string[];
  quality: string[];
  all: string[];
}

interface Config {
  port: number;
  stac: { baseUrl: string };
  wtss: { baseUrl: string };
  defaultCollections: string[];
  defaultCoverages: string[];
  availableBands: Record<string, AvailableBands>;
  bandMetadata: Record<string, BandMetadata>;
  defaults: Record<string, any>;
  userVariables: Record<string, string[]>;
  variableLabels: Record<string, string>;
}

// ✅ CONFIG COM TIPAGEM EXPLÍCITA
export const config: Config = {
  // Servidor
  port: process.env.PORT || 5000,

  // APIs Externas
  stac: {
    baseUrl: "https://data.inpe.br/bdc/stac/v1",
  },

  wtss: {
    baseUrl: "https://data.inpe.br/bdc/wtss/v4",
  },

  // Coleções/Coverages padrão (nomes corretos WTSS - case sensitive!)
  defaultCollections: ["S2_L2A", "LANDSAT-16D-1", "mod13q1-6.1"], // STAC
  defaultCoverages: ["mod13q1-6.1", "S2-16D-2", "LANDSAT-16D-1"], // WTSS (minúsculo!)

  // ✅ Bandas disponíveis por satélite
  availableBands: {
    "S2-16D-2": {
      // Bandas espectrais
      spectral: ["BAND5", "BAND6", "BAND7", "BAND8"], // Blue, Green, Red, NIR
      // Índices de vegetação
      indices: ["NDVI", "EVI"],
      // Bandas de qualidade
      quality: ["CMASK", "CLEAROB", "TOTALOB", "PROVENANCE"],
      // Todas as bandas
      all: [
        "BAND5",
        "BAND6",
        "BAND7",
        "BAND8",
        "NDVI",
        "EVI",
        "CMASK",
        "CLEAROB",
        "TOTALOB",
        "PROVENANCE",
      ],
    },
    "LANDSAT-16D-1": {
      spectral: ["BAND2", "BAND3", "BAND4", "BAND5"], // Blue, Green, Red, NIR
      indices: ["NDVI", "EVI"],
      quality: ["CMASK", "CLEAROB", "TOTALOB", "PROVENANCE"],
      all: [
        "BAND2",
        "BAND3",
        "BAND4",
        "BAND5",
        "NDVI",
        "EVI",
        "CMASK",
        "CLEAROB",
        "TOTALOB",
        "PROVENANCE",
      ],
    },
    "mod13q1-6.1": {
      spectral: ["blue", "red", "nir", "mir"],
      indices: ["NDVI", "EVI"],
      quality: ["pixel_reliability", "view_zenith_angle"],
      all: [
        "blue",
        "red",
        "nir",
        "mir",
        "NDVI",
        "EVI",
        "pixel_reliability",
        "view_zenith_angle",
      ],
    },
  },

  // ✅ Metadados das bandas (para validação e processamento)
  bandMetadata: {
    // Sentinel-2
    BAND5: {
      common_name: "blue",
      scale: 0.0001,
      nodata: -9999,
      data_type: "int16",
      resolution: 20,
      min_value: 0,
      max_value: 10000,
    },
    BAND6: {
      common_name: "green",
      scale: 0.0001,
      nodata: -9999,
      data_type: "int16",
      resolution: 20,
      min_value: 0,
      max_value: 10000,
    },
    BAND7: {
      common_name: "red",
      scale: 0.0001,
      nodata: -9999,
      data_type: "int16",
      resolution: 20,
      min_value: 0,
      max_value: 10000,
    },
    BAND8: {
      common_name: "nir",
      scale: 0.0001,
      nodata: -9999,
      data_type: "int16",
      resolution: 20,
      min_value: 0,
      max_value: 10000,
    },
    NDVI: {
      common_name: "ndvi",
      scale: 0.0001,
      nodata: -9999,
      data_type: "int16",
      resolution: 20,
      min_value: -10000,
      max_value: 10000,
    },
    EVI: {
      common_name: "evi",
      scale: 0.0001,
      nodata: -9999,
      data_type: "int16",
      resolution: 20,
      min_value: -10000,
      max_value: 10000,
    },
    CMASK: {
      common_name: "quality",
      scale: 1,
      nodata: 255,
      data_type: "uint8",
      resolution: 20,
      min_value: 0,
      max_value: 4,
    },
    CLEAROB: {
      common_name: "ClearOb",
      scale: 1,
      nodata: 0,
      data_type: "uint8",
      resolution: 20,
      min_value: 0,
      max_value: 255,
    },
    TOTALOB: {
      common_name: "TotalOb",
      scale: 1,
      nodata: 0,
      data_type: "uint8",
      resolution: 20,
      min_value: 0,
      max_value: 255,
    },
    PROVENANCE: {
      common_name: "Provenance",
      scale: 1,
      nodata: -1,
      data_type: "int16",
      resolution: 20,
      min_value: 1,
      max_value: 366,
    },
  },

  // Parâmetros padrão
  defaults: {
    startDate: "2024-01-01",
    endDate: "2024-10-06",
    variable: "NDVI",
    bboxDelta: 0.01, // ~1km
    maxResults: 20,
  },

  // ✅ Variáveis disponíveis no frontend (filtradas para usuário)
  userVariables: {
    "S2-16D-2": ["NDVI", "EVI", "BAND5", "BAND6", "BAND7", "BAND8"],
    "LANDSAT-16D-1": ["NDVI", "EVI", "BAND2", "BAND3", "BAND4", "BAND5"],
    "mod13q1-6.1": ["NDVI", "EVI", "blue", "red", "nir"],
  },

  // ✅ Mapeamento de nomes amigáveis
  variableLabels: {
    // Índices
    NDVI: "NDVI - Índice de Vegetação",
    EVI: "EVI - Vegetação Melhorada",

    // Sentinel-2
    BAND5: "Banda 5 - Azul",
    BAND6: "Banda 6 - Verde",
    BAND7: "Banda 7 - Vermelho",
    BAND8: "Banda 8 - Infravermelho Próximo",

    // Landsat
    BAND2: "Banda 2 - Azul",
    BAND3: "Banda 3 - Verde",
    BAND4: "Banda 4 - Vermelho",
    BAND5: "Banda 5 - Infravermelho Próximo",

    // MODIS
    blue: "Banda Azul",
    red: "Banda Vermelha",
    nir: "Infravermelho Próximo",
    mir: "Infravermelho Médio",
  },
};
