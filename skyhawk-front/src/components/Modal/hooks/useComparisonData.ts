import { useState } from "react";
import { skyHawkService } from "../../../services/skyHawkService";
import type { TimeSeriesData } from "../../../services/skyHawkService";

interface ComparisonDataState {
  [variable: string]: TimeSeriesData | null;
}

export function useComparisonData() {
  const [data1, setData1] = useState<ComparisonDataState>({});
  const [data2, setData2] = useState<ComparisonDataState>({});
  const [loading1, setLoading1] = useState<Set<string>>(new Set());
  const [loading2, setLoading2] = useState<Set<string>>(new Set());
  const [error1, setError1] = useState<string | null>(null);
  const [error2, setError2] = useState<string | null>(null);

  const fetchComparison = async (
    coordinates: { lat: number; lng: number },
    params: {
      satellite1: string;
      satellite2: string;
      variables: string[];
      startDate: string;
      endDate: string;
    }
  ) => {
    console.log("🔄 Buscando dados para comparação:");
    console.log("Satélite 1:", params.satellite1);
    console.log("Satélite 2:", params.satellite2);
    console.log("Variáveis:", params.variables);

    setError1(null);
    setError2(null);

    // Buscar cada variável para cada satélite
    for (const variable of params.variables) {
      // ✅ SATÉLITE 1
      setLoading1((prev) => new Set(prev).add(variable));
      try {
        const result1 = await skyHawkService.getTimeSeries(
          coordinates.lat,
          coordinates.lng,
          {
            satellite: params.satellite1,
            variable,
            startDate: params.startDate,
            endDate: params.endDate,
          }
        );
        console.log(`✅ ${params.satellite1} - ${variable}:`, result1);
        setData1((prev) => ({ ...prev, [variable]: result1 }));
      } catch (err) {
        console.error(`❌ ${params.satellite1} - ${variable}:`, err);
        setData1((prev) => ({ ...prev, [variable]: null }));
      } finally {
        setLoading1((prev) => {
          const newSet = new Set(prev);
          newSet.delete(variable);
          return newSet;
        });
      }

      // ✅ SATÉLITE 2
      setLoading2((prev) => new Set(prev).add(variable));
      try {
        const result2 = await skyHawkService.getTimeSeries(
          coordinates.lat,
          coordinates.lng,
          {
            satellite: params.satellite2,
            variable,
            startDate: params.startDate,
            endDate: params.endDate,
          }
        );
        console.log(`✅ ${params.satellite2} - ${variable}:`, result2);
        setData2((prev) => ({ ...prev, [variable]: result2 }));
      } catch (err) {
        console.error(`❌ ${params.satellite2} - ${variable}:`, err);
        setData2((prev) => ({ ...prev, [variable]: null }));
      } finally {
        setLoading2((prev) => {
          const newSet = new Set(prev);
          newSet.delete(variable);
          return newSet;
        });
      }
    }
  };

  return {
    data1,
    data2,
    loading1,
    loading2,
    error1,
    error2,
    fetchComparison,
  };
}
