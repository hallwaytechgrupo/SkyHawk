import { useState } from "react";
import { skyHawkService } from "../../../services/skyHawkService";
import { satelliteVariables } from "../constants";
import type { MultiSeriesData, FilterParams } from "../types";

export const useComparisonData = (
  coordinates: { lat: number; lng: number } | null,
  isActive: boolean,
  satellite1: string,
  satellite2: string,
  filters: Omit<FilterParams, "satellite">
) => {
  const [data1, setData1] = useState<MultiSeriesData>({});
  const [data2, setData2] = useState<MultiSeriesData>({});
  const [loading1, setLoading1] = useState<Set<string>>(new Set());
  const [loading2, setLoading2] = useState<Set<string>>(new Set());

  const fetchSatelliteData = async (
    satellite: string,
    setData: React.Dispatch<React.SetStateAction<MultiSeriesData>>,
    setLoading: React.Dispatch<React.SetStateAction<Set<string>>>
  ) => {
    if (!coordinates || !isActive) return;

    const variables = satelliteVariables[satellite] || [];
    console.log(`🚀 Buscando dados de ${satellite}:`, variables);

    setLoading(new Set(variables));

    for (const variable of variables) {
      try {
        const response = await skyHawkService.getTimeSeries(
          coordinates.lat,
          coordinates.lng,
          {
            satellite,
            variable,
            startDate: filters.startDate,
            endDate: filters.endDate,
          }
        );

        console.log(`✅ ${satellite} - ${variable}:`, response);

        setData((prev) => ({
          ...prev,
          [variable]: response,
        }));

        setLoading((prev) => {
          const newSet = new Set(prev);
          newSet.delete(variable);
          return newSet;
        });

        // Aguardar 500ms entre requisições para não sobrecarregar
        await new Promise((resolve) => setTimeout(resolve, 500));
      } catch (error) {
        console.error(`❌ Erro ao buscar ${satellite} - ${variable}:`, error);

        setLoading((prev) => {
          const newSet = new Set(prev);
          newSet.delete(variable);
          return newSet;
        });
      }
    }
  };

  const fetchBothSatellites = async () => {
    setData1({});
    setData2({});

    // Buscar ambos em paralelo
    await Promise.all([
      fetchSatelliteData(satellite1, setData1, setLoading1),
      fetchSatelliteData(satellite2, setData2, setLoading2),
    ]);
  };

  return {
    data1,
    data2,
    loading1,
    loading2,
    fetchBothSatellites,
  };
};
