import { useState, useEffect } from "react";
import { fetchLocationInfo } from "../utils";
import { satelliteVariables } from "../constants";
import type { MultiSeriesData, LocationInfo, FilterParams } from "../types";
import type { TimeSeriesData } from "../../../services/skyHawkService";

export const useModalData = (
  coordinates: { lat: number; lng: number } | null,
  isOpen: boolean,
  filters: FilterParams,
  data: TimeSeriesData | null,
  onFiltersChange: (filters: FilterParams) => void
) => {
  const [multiSeriesData, setMultiSeriesData] = useState<MultiSeriesData>({});
  const [loadingVariables, setLoadingVariables] = useState<Set<string>>(
    new Set()
  );
  const [locationInfo, setLocationInfo] = useState<LocationInfo | null>(null);

  // Buscar informações de localização
  useEffect(() => {
    if (coordinates && isOpen) {
      setLocationInfo({ city: "", country: "", loading: true });

      fetchLocationInfo(coordinates.lat, coordinates.lng)
        .then((info) => {
          setLocationInfo({ ...info, loading: false });
        })
        .catch(() => {
          setLocationInfo({
            city: "Localização não encontrada",
            country: "",
            loading: false,
          });
        });
    }
  }, [coordinates, isOpen]);

  // Buscar todas as variáveis do satélite
  const fetchAllVariables = async (satellite: string) => {
    const variables = satelliteVariables[satellite] || [];
    console.log(`🚀 Buscando todas as variáveis de ${satellite}:`, variables);

    setLoadingVariables(new Set(variables));

    for (const variable of variables) {
      try {
        console.log(`📡 Buscando ${variable}...`);
        const tempFilters = { ...filters, satellite, variable };
        onFiltersChange(tempFilters);
        await new Promise((resolve) => setTimeout(resolve, 500));
      } catch (err) {
        console.error(`❌ Erro ao buscar ${variable}:`, err);
      }
    }

    setLoadingVariables(new Set());
  };

  // Atualizar dados quando receber nova série
  useEffect(() => {
    if (data?.success && data.data) {
      const variable = data.data.metadata.variable;
      console.log(`✅ Dados recebidos para ${variable}`);

      setMultiSeriesData((prev) => ({
        ...prev,
        [variable]: data,
      }));

      setLoadingVariables((prev) => {
        const newSet = new Set(prev);
        newSet.delete(variable);
        return newSet;
      });
    }
  }, [data]);

  // Quando satélite mudar
  useEffect(() => {
    if (filters.satellite && coordinates && isOpen) {
      console.log(`🔄 Satélite mudou para: ${filters.satellite}`);
      setMultiSeriesData({});
      fetchAllVariables(filters.satellite);
    }
  }, [filters.satellite, coordinates, isOpen]);

  return {
    multiSeriesData,
    loadingVariables,
    locationInfo,
    fetchAllVariables,
  };
};
