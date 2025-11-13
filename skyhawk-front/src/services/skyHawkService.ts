// Serviço para comunicação com a API SkyHawk
export interface TimeSeriesData {
  success: boolean;
  data: {
    metadata: {
      variable: string;
      collection: string;
      resolution: string;
      satellite: string;
      period: {
        start: string;
        end: string;
      };
    };
    timeline: string[];
    values: number[];
    statistics: {
      min: number;
      max: number;
      mean: number;
      count: number;
    };
  };
  message?: string;
}

export interface FilterParams {
  satellite: string;
  variable: string;
  startDate: string;
  endDate: string;
}

// Função para gerar dados mock realistas
function generateMockTimeSeriesData(
  lat: number,
  lng: number,
  filters: FilterParams
): TimeSeriesData {
  const { satellite, variable, startDate, endDate } = filters;

  // Gerar timeline entre as datas
  const start = new Date(startDate);
  const end = new Date(endDate);
  const timeline: string[] = [];
  const values: number[] = [];

  // eslint-disable-next-line prefer-const
  let current = new Date(start);
  let baseValue = 0.5; // Valor base para simulação

  // Definir ranges por variável
  const variableRanges: Record<
    string,
    { min: number; max: number; base: number }
  > = {
    ndvi: { min: -1, max: 1, base: 0.6 },
    evi: { min: -1, max: 1, base: 0.4 },
    ndwi: { min: -1, max: 1, base: 0.2 },
    lst: { min: 250, max: 320, base: 290 }, // Kelvin
    precipitation: { min: 0, max: 100, base: 15 },
  };

  const range = variableRanges[variable] || variableRanges.ndvi;
  baseValue = range.base;

  // Gerar dados mensais
  while (current <= end) {
    timeline.push(current.toISOString().split("T")[0]);

    // Adicionar variação sazonal e ruído
    const seasonalFactor =
      Math.sin((current.getMonth() / 12) * 2 * Math.PI) * 0.3;
    const noise = (Math.random() - 0.5) * 0.2;
    const value = Math.max(
      range.min,
      Math.min(range.max, baseValue + seasonalFactor + noise)
    );

    values.push(Number(value.toFixed(4)));

    // Próximo mês
    current.setMonth(current.getMonth() + 1);
  }

  // Calcular estatísticas
  const statistics = {
    min: Math.min(...values),
    max: Math.max(...values),
    mean: Number(
      (values.reduce((a, b) => a + b, 0) / values.length).toFixed(4)
    ),
    count: values.length,
  };

  return {
    success: true,
    data: {
      metadata: {
        variable: variable.toUpperCase(),
        collection: satellite.toUpperCase(),
        resolution: satellite.includes("landsat") ? "30m" : "10m",
        satellite: satellite.toUpperCase(),
        period: {
          start: startDate,
          end: endDate,
        },
      },
      timeline,
      values,
      statistics,
    },
    message: `Dados simulados para ${variable.toUpperCase()} do ${satellite.toUpperCase()} em ${lat.toFixed(
      4
    )}, ${lng.toFixed(4)}`,
  };
}

export class SkyHawkService {
  private baseUrl: string;
  private useMockData: boolean = false;

  constructor(baseUrl: string = "http://localhost:5000/api") {
    this.baseUrl = baseUrl;
  }

  async checkBackendHealth(): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/health`, {
        method: "GET",
      });
      return response.ok;
    } catch {
      return false;
    }
  }

  async getTimeSeries(
    lat: number,
    lng: number,
    filters: FilterParams
  ): Promise<TimeSeriesData> {
    try {
      const backendAvailable = await this.checkBackendHealth();

      if (!backendAvailable) {
        console.warn("⚠️  Backend não disponível. Usando dados simulados...");
        await new Promise((resolve) => setTimeout(resolve, 1000));
        return generateMockTimeSeriesData(lat, lng, filters);
      }

      // ✅ CORRIGIR A URL - REMOVER "/satellite"
      // ❌ ANTES: const endpoint = `${this.baseUrl}/satellite/time-series`;
      // ✅ AGORA:
      const endpoint = `${this.baseUrl}/time-series`;

      const body = {
        lat: lat,
        lng: lng,
        satellite: filters.satellite,
        variable: filters.variable,
        startDate: filters.startDate,
        endDate: filters.endDate,
      };

      console.log(`🚀 Fazendo requisição POST para: ${endpoint}`);
      console.log("📦 Payload:", JSON.stringify(body, null, 2));

      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      console.log(`📡 Resposta: ${response.status} ${response.statusText}`);

      if (!response.ok) {
        let errorMessage = `Erro HTTP: ${response.status}`;
        let errorDetails = null;

        try {
          errorDetails = await response.json();
          console.error("📛 Erro do backend:", errorDetails);
          errorMessage =
            errorDetails.error || errorDetails.message || errorMessage;
        } catch {
          const textError = await response.text();
          console.error("📛 Resposta do servidor:", textError);
        }

        throw new Error(errorMessage);
      }

      const data = await response.json();
      console.log("✅ Dados recebidos do backend:", data);
      return data;
    } catch (error) {
      console.error("❌ Erro no serviço SkyHawk:", error);
      console.warn("🔄 Usando dados simulados como fallback...");
      await new Promise((resolve) => setTimeout(resolve, 500));
      return generateMockTimeSeriesData(lat, lng, filters);
    }
  }

  async getSatellites(): Promise<
    Array<{ id: string; name: string; description: string }>
  > {
    try {
      const response = await fetch(`${this.baseUrl}/satellite/collections`);

      if (!response.ok) {
        throw new Error(`Erro ao buscar satélites: ${response.status}`);
      }

      return response.json();
    } catch {
      // Retornar dados mock para satélites
      console.warn("Usando lista mock de satélites");
      return [
        {
          id: "landsat8",
          name: "Landsat 8",
          description: "Satélite de observação da Terra da NASA/USGS",
        },
        {
          id: "landsat9",
          name: "Landsat 9",
          description: "Satélite mais recente da série Landsat",
        },
        {
          id: "sentinel2",
          name: "Sentinel-2",
          description: "Satélite de alta resolução da ESA",
        },
        {
          id: "modis",
          name: "MODIS Terra",
          description: "Sensor MODIS a bordo do satélite Terra",
        },
      ];
    }
  }

  async getVariables(
    satellite: string
  ): Promise<Array<{ id: string; name: string; unit: string }>> {
    try {
      const response = await fetch(
        `${this.baseUrl}/satellite/variables?satellite=${satellite}`
      );

      if (!response.ok) {
        throw new Error(`Erro ao buscar variáveis: ${response.status}`);
      }

      return response.json();
    } catch {
      // Retornar dados mock para variáveis
      console.warn("Usando lista mock de variáveis");
      return [
        {
          id: "ndvi",
          name: "NDVI (Índice de Vegetação)",
          unit: "adimensional",
        },
        {
          id: "evi",
          name: "EVI (Índice de Vegetação Melhorado)",
          unit: "adimensional",
        },
        { id: "ndwi", name: "NDWI (Índice de Água)", unit: "adimensional" },
        { id: "lst", name: "LST (Temperatura da Terra)", unit: "Kelvin" },
        { id: "precipitation", name: "Precipitação", unit: "mm" },
      ];
    }
  }

  async exportData(params: {
    satellite: string;
    variable: string;
    startDate: string;
    endDate: string;
    lat: number;
    lng: number;
    format: 'csv' | 'json';
  }): Promise<void> {
    const { satellite, variable, startDate, endDate, lat, lng, format } =
      params;

    const qs = new URLSearchParams({
      format,
      collections: satellite,
      variable,
      startDate,
      endDate,
      lat: String(lat),
      lng: String(lng),
    });

    // Ensure we use an absolute URL. Normalize baseUrl when necessary.
    const normalize = (b: string) => {
      if (!b) return '';
      // already absolute
      if (b.startsWith('http://') || b.startsWith('https://')) return b.replace(/\/+$/, '');
      // starts with port like :5000 or :5000/api
      if (b.startsWith(':')) {
        return `${window.location.protocol}//${window.location.hostname}${b}`.replace(/\/+$/, '');
      }
      // starts with / (absolute path)
      if (b.startsWith('/')) return `${window.location.origin}${b}`.replace(/\/+$/, '');
      // otherwise relative - prepend origin
      return `${window.location.origin}/${b}`.replace(/\/+$/, '');
    };

    const base = normalize(this.baseUrl);
    const urlCandidates = [
      `${base}/export?${qs.toString()}`,
      // fallback: if base contains /api try without it
      base.includes('/api') ? `${base.replace(/\/api$/, '')}/export?${qs.toString()}` : null,
      // fallback: try absolute path on current origin
      `${window.location.origin}/api/export?${qs.toString()}`,
      `${window.location.origin}/export?${qs.toString()}`,
    ].filter(Boolean) as string[];

    let lastErr: any = null;
    let response: Response | null = null;

    for (const u of urlCandidates) {
      try {
        response = await fetch(u, { method: 'GET' });
        // network-level failure will throw; non-OK stays to be handled below
        if (response) {
          // if 404 or other non-ok, still return response to inspect
          break;
        }
      } catch (err) {
        lastErr = err;
        // try next candidate
      }
    }

    if (!response) {
      throw new Error(`Erro ao exportar: falha de rede (${lastErr?.message || 'unknown'})`);
    }

    if (!response.ok) {
      const text = await response.text().catch(() => '');
      throw new Error(`Erro ao exportar: ${response.status} - ${text}`);
    }

    const blob = await response.blob();

    // Determine filename from Content-Disposition or fallback
    let filename = format === 'csv' ? 'export.csv' : 'export.json';
    const cd = response.headers.get('content-disposition');
    if (cd) {
      const match = /filename="?([^";]+)"?/.exec(cd);
      if (match && match[1]) filename = match[1];
    }

    const href = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = href;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(href);
  }
}

export const skyHawkService = new SkyHawkService();
