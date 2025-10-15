/**
 * Serviço para interagir com a API WTSS do INPE
 */

import axios from "axios";
import { config } from "../config";
import { TimeSeries } from "../types";

const WTSS_BASE_URL = config.wtss.baseUrl;

/**
 * Obtém série temporal de uma variável para um ponto específico
 * IMPORTANTE: API WTSS usa GET com query params, não POST!
 */
export async function getTimeSeries(
  lat: number,
  lng: number,
  coverage: string,
  attributes: string[],
  startDate: string,
  endDate: string
): Promise<TimeSeries> {
  // Monta query parameters corretamente
  const params = {
    coverage,
    attributes: attributes.join(","), // Ex: "NDVI,EVI"
    latitude: lat,
    longitude: lng,
    start_date: startDate,
    end_date: endDate,
  };

  console.log("📡 Chamando WTSS com params:", params);

  try {
    // API WTSS usa GET, não POST!
    const res = await axios.get(`${WTSS_BASE_URL}/time_series`, { params });

    console.log("✅ Resposta WTSS:", JSON.stringify(res.data, null, 2));

    // Estrutura real da resposta WTSS:
    // { result: { attributes: [{attribute: "NDVI", values: [...]}], timeline: [...], query: {...} } }
    const data = res.data as { result?: any };
    const result = data.result;

    if (!result || !result.timeline) {
      throw new Error("Resposta inválida da API WTSS");
    }

    const timeline = result.timeline;

    // Pega o primeiro atributo (normalmente só pedimos um)
    const firstAttribute = result.attributes[0];
    const values = firstAttribute.values;
    const attributeName = firstAttribute.attribute;

    console.log(
      `✅ Sucesso: ${timeline.length} pontos, ${attributeName}: [${values
        .slice(0, 3)
        .join(", ")}...]`
    );

    return {
      timeline,
      values,
      metadata: {
        collection: coverage,
        variable: attributeName,
        resolution: "250m", // MODIS padrão, ajustar por coverage depois
      },
    };
  } catch (error: any) {
    console.error("❌ Erro WTSS:", error.response?.data || error.message);

    // Fallback vazio (melhor que mock, para debug)
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

/**
 * Obtém múltiplas séries temporais em paralelo (vários satélites)
 */
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

/**
 * Lista coverages disponíveis
 */
export async function listCoverages(): Promise<string[]> {
  try {
    const res = await axios.get(`${WTSS_BASE_URL}/list_coverages`);
    const data = res.data as { coverages?: string[] };
    return data.coverages || [];
  } catch (error) {
    console.error("Erro ao listar coverages:", error);
    return ["mod13q1-6.1", "myd13q1-6.1", "S2-16D-2", "LANDSAT-16D-1"]; // Fallback com nomes corretos
  }
}

/**
 * Descreve uma coverage (satélite) específica
 */
export async function describeCoverage(coverageName: string): Promise<any> {
  try {
    const res = await axios.get(`${WTSS_BASE_URL}/describe_coverage`, {
      params: { name: coverageName },
    });
    return res.data;
  } catch (error) {
    console.error(`Erro ao descrever coverage ${coverageName}:`, error);
    return null;
  }
}
