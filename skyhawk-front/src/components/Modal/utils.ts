import type { Anomaly, Statistics } from "./types";

// ✅ ATUALIZADO: Retornar 0 para valores inválidos
export const applyScaleFactor = (value: number, variable: string): number => {
  // Retornar 0 para valores inválidos
  if (value === null || value === undefined || isNaN(value)) {
    return 0;
  }

  if (variable.includes("LST")) {
    // MODIS LST usa fator de escala de 0.02
    // Valores válidos sem escala: 7500-17500 (multiplicar por 0.02 = 150K-350K)
    if (value > 500) {
      return value * 0.02;
    }
  }

  return value;
};

// ✅ ATUALIZADO: Conversão com tratamento para zeros
export const kelvinToCelsius = (kelvin: number): number => {
  if (isNaN(kelvin) || kelvin === 0) {
    return 0;
  }

  return kelvin - 273.15;
};

// ✅ ATUALIZADO: Validação de temperatura
export const isValidTemperature = (
  value: number,
  variable: string
): boolean => {
  if (isNaN(value) || value === 0) {
    return false;
  }

  const correctedValue = applyScaleFactor(value, variable);

  if (correctedValue === 0) {
    return false;
  }

  if (variable === "LST_Day_1km") {
    return correctedValue >= 250 && correctedValue <= 350;
  }
  if (variable === "LST_Night_1km") {
    return correctedValue >= 240 && correctedValue <= 320;
  }
  return true;
};

export const isValidIndex = (value: number, variable: string): boolean => {
  if (isNaN(value) || value === null || value === undefined) {
    return false;
  }

  switch (variable) {
    case "NDVI":
    case "EVI":
    case "NDWI":
      return value >= -1 && value <= 1;
    default:
      return true;
  }
};

// ✅ ATUALIZADO: Formatação do tooltip (mantém tratamento de zeros)
export const formatTooltipValue = (value: number, variable: string): string => {
  if (isNaN(value) || value === 0 || value === null || value === undefined) {
    return "Sem dados";
  }

  if (variable.includes("LST")) {
    const correctedValue = applyScaleFactor(value, variable);

    if (correctedValue === 0) {
      return "Sem dados";
    }

    const celsius = kelvinToCelsius(correctedValue);

    if (value !== correctedValue && value > 500) {
      return `${correctedValue.toFixed(2)}K (${celsius.toFixed(
        1
      )}°C) • Raw: ${value.toFixed(0)}`;
    }

    return `${correctedValue.toFixed(2)}K (${celsius.toFixed(1)}°C)`;
  }

  return value.toFixed(3);
};

// ✅ ATUALIZADO: Calcular estatísticas ignorando zeros
export const calculateStats = (
  values: number[],
  variable: string
): Statistics | null => {
  // Aplicar correção de escala e filtrar zeros/inválidos
  const correctedValues = values
    .map((v) => (variable.includes("LST") ? applyScaleFactor(v, variable) : v))
    .filter((v) => !isNaN(v) && v !== 0 && v !== null && v !== undefined);

  if (correctedValues.length === 0) {
    return null;
  }

  const sum = correctedValues.reduce((acc, val) => acc + val, 0);
  const avg = sum / correctedValues.length;
  const min = Math.min(...correctedValues);
  const max = Math.max(...correctedValues);

  const squaredDiffs = correctedValues.map((v) => Math.pow(v - avg, 2));
  const variance =
    squaredDiffs.reduce((acc, val) => acc + val, 0) / correctedValues.length;
  const stdDev = Math.sqrt(variance);

  return {
    avg,
    min,
    max,
    stdDev,
    count: correctedValues.length,
    total: values.length,
    validPercentage: (correctedValues.length / values.length) * 100,
  };
};

export const detectAnomalies = (
  values: number[],
  variable: string
): Anomaly[] => {
  const anomalies: Anomaly[] = [];

  values.forEach((value, index) => {
    if (variable.includes("LST")) {
      const correctedValue = applyScaleFactor(value, variable);

      // Detectar valores que precisam de correção
      if (value > 500 && value !== correctedValue) {
        anomalies.push({
          value,
          index,
          reason: `Fator de escala aplicado: ${value.toFixed(
            0
          )} → ${correctedValue.toFixed(2)}K`,
        });
      }

      if (!isValidTemperature(value, variable)) {
        const celsius = kelvinToCelsius(correctedValue);
        anomalies.push({
          value,
          index,
          reason: `Temperatura fora do intervalo: ${correctedValue.toFixed(
            2
          )}K (${celsius.toFixed(2)}°C)`,
        });
      }

      if (value === 0) {
        anomalies.push({
          value,
          index,
          reason: "Temperatura zero (dado ausente)",
        });
      }
    }

    if (!isValidIndex(value, variable)) {
      anomalies.push({
        value,
        index,
        reason: `${variable} fora do intervalo [-1, 1]: ${value.toFixed(3)}`,
      });
    }
  });

  return anomalies;
};

export const fetchLocationInfo = async (
  lat: number,
  lng: number
): Promise<{
  city: string;
  state?: string;
  country: string;
}> => {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&accept-language=pt-BR,pt,en`
    );

    if (!response.ok) {
      throw new Error("Erro na geocodificação");
    }

    const data = await response.json();
    const address = data.address || {};
    const city =
      address.city ||
      address.town ||
      address.village ||
      address.municipality ||
      address.county ||
      "Localização desconhecida";

    const state = address.state || address.region;
    const country = address.country || "País desconhecido";

    return { city, state, country };
  } catch (error) {
    console.error("Erro ao buscar informações da localização:", error);
    return {
      city: "Localização não encontrada",
      country: "",
    };
  }
};
