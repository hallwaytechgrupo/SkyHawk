/**
 * Serviço para interagir com a API WTSS do INPE
 */

import axios from "axios";
import { config } from "../config";
import { TimeSeries } from "../types";

const WTSS_BASE_URL = config.wtss.baseUrl;

// ✅ INTERFACES PARA TIPAGEM DA API WTSS
interface WTSSAttributeData {
  values: number[];
  attribute?: string;
  metadata?: {
    resolution?: string;
  };
}

interface WTSSResult {
  timeline: string[];
  attributes: WTSSAttributeData[] | Record<string, WTSSAttributeData>;
}

interface WTSSTimeSeriesResponse {
  result?: WTSSResult;
}

interface WTSSListCoveragesResponse {
  coverages?: string[];
}

// ✅ FATORES DE ESCALA
const SCALE_FACTORS: Record<string, number> = {
  NDVI: 10000,
  EVI: 10000,
  NDWI: 10000,
  NIR: 10000,
  RED: 10000,
  BLUE: 10000,
  MIR: 10000,
};

/**
 * Aplicar fator de escala aos valores
 */
function applyScaleFactor(
  values: number[],
  variable: string
): (number | null)[] {
  const scaleFactor = SCALE_FACTORS[variable.toUpperCase()] || 1;

  console.log(`🔢 Aplicando escala:`);
  console.log(`  Variável: ${variable}`);
  console.log(`  Fator: ${scaleFactor}`);
  console.log(`  Valores originais (primeiros 3):`, values.slice(0, 3));

  const scaled = values.map((value) => {
    if (value === null || value === undefined || isNaN(value)) {
      return null;
    }
    return Number((value / scaleFactor).toFixed(4));
  });

  console.log(`  Valores escalados (primeiros 3):`, scaled.slice(0, 3));

  return scaled;
}

/**
 * Obtém série temporal
 */
export async function getTimeSeries(
  lat: number,
  lng: number,
  coverage: string,
  attributes: string[],
  startDate: string,
  endDate: string
): Promise<TimeSeries> {
  const params = {
    coverage,
    attributes: attributes.join(","),
    latitude: lat,
    longitude: lng,
    start_date: startDate,
    end_date: endDate,
  };

  console.log("📡 Chamando WTSS:");
  console.log(`  URL: ${WTSS_BASE_URL}/time_series`);
  console.log("  Params:", params);

  try {
    const res = await axios.get<WTSSTimeSeriesResponse>(
      `${WTSS_BASE_URL}/time_series`,
      { params }
    );

    console.log("✅ Resposta WTSS recebida");

    const result = res.data?.result;

    if (!result || !result.timeline) {
      console.error("⚠️ Resposta WTSS inválida:", res.data);
      throw new Error("Resposta inválida da API WTSS");
    }

    const timeline = result.timeline;
    let values: number[] = [];
    let attributeName = attributes[0];
    let resolution = "N/A";

    // Tentar formato 1: array
    if (Array.isArray(result.attributes)) {
      const firstAttribute = result.attributes[0];
      values = firstAttribute?.values || [];
      attributeName = firstAttribute?.attribute || attributes[0];
      resolution = firstAttribute?.metadata?.resolution || "N/A";
    }
    // Tentar formato 2: objeto
    else if (result.attributes && typeof result.attributes === "object") {
      const attrData = result.attributes[attributes[0]];
      values = attrData?.values || [];
      resolution = attrData?.metadata?.resolution || "N/A";
    }

    console.log(`📊 Dados brutos da API:`);
    console.log(`  Timeline: ${timeline.length} datas`);
    console.log(`  Valores brutos (primeiros 5):`, values.slice(0, 5));
    console.log(`  Atributo: ${attributeName}`);
    console.log(`  Resolução: ${resolution}`);

    // ✅ APLICAR ESCALA
    const scaledValues = applyScaleFactor(values, attributeName);

    console.log(`✅ Processado:`);
    console.log(`  Valores finais (primeiros 5):`, scaledValues.slice(0, 5));

    return {
      timeline,
      values: scaledValues,
      metadata: {
        collection: coverage,
        variable: attributeName,
        resolution: resolution,
      },
    };
  } catch (error: any) {
    console.error("❌ Erro WTSS:", {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
    });

    return {
      timeline: [],
      values: [],
      metadata: {
        collection: coverage,
        variable: attributes[0],
        resolution: "N/A",
      },
    };
  }
}

export async function getMultipleTimeSeries(
  lat: number,
  lng: number,
  coverages: string[],
  attributes: string[],
  startDate: string,
  endDate: string
): Promise<TimeSeries[]> {
  const promises = coverages.map((coverage) =>
    getTimeSeries(lat, lng, coverage, attributes, startDate, endDate)
  );
  return Promise.all(promises);
}

export async function listCoverages(): Promise<string[]> {
  try {
    const url = `${WTSS_BASE_URL}/list_coverages`;
    console.log(`📋 Listando coverages: ${url}`);
    const response = await axios.get<WTSSListCoveragesResponse>(url);
    const coverages = response.data?.coverages || [];
    console.log(`✅ Coverages encontradas: ${coverages.length}`);
    return coverages;
  } catch (error) {
    console.error("❌ Erro ao listar coverages:", error);
    throw error;
  }
}

export async function describeCoverage(coverageName: string): Promise<any> {
  try {
    const url = `${WTSS_BASE_URL}/describe_coverage`;
    console.log(`📋 Descrevendo coverage: ${coverageName}`);
    const response = await axios.get(url, { params: { name: coverageName } });
    console.log(`✅ Coverage descrita:`, response.data);
    return response.data;
  } catch (error) {
    console.error(`❌ Erro ao descrever coverage ${coverageName}:`, error);
    throw error;
  }
}
