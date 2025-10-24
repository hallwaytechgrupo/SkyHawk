import type React from "react";
import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  Satellite,
  MapPin,
  TrendingUp,
  BarChart3,
  X,
  Loader2,
  Calendar,
  Filter,
  RefreshCw,
} from "lucide-react";
import type { TimeSeriesData } from "../services/skyHawkService";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: TimeSeriesData | null;
  coordinates: { lat: number; lng: number } | null;
  loading: boolean;
  error: string | null;
  onFiltersChange: (filters: FilterParams) => void;
}

interface FilterParams {
  satellite: string;
  variable: string;
  startDate: string;
  endDate: string;
}

// Interface para informações de localização
interface LocationInfo {
  city: string;
  state?: string;
  country: string;
  loading: boolean;
}

// Opções dos filtros
const satelliteOptions = [
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

// ✅ VARIÁVEIS CORRETAS (MAIÚSCULAS)
const variableOptions = [
  {
    value: "NDVI",
    label: "NDVI - Índice de Vegetação",
    satellites: [
      "S2-16D-2",
      "LANDSAT-16D-1",
      "mod13q1-6.1",
      "myd13q1-6.1",
      "CBERS4-MUX-2M-1",
      "CBERS4-WFI-16D-2",
      "CBERS-WFI-8D-1",
    ],
  },
  {
    value: "EVI",
    label: "EVI - Vegetação Melhorada",
    satellites: ["S2-16D-2", "LANDSAT-16D-1", "mod13q1-6.1", "myd13q1-6.1"],
  },
  {
    value: "NDWI",
    label: "NDWI - Índice de Água",
    satellites: ["S2-16D-2", "LANDSAT-16D-1"],
  },
  {
    value: "LST_Day_1km",
    label: "LST - Temperatura Diurna",
    satellites: ["mod11a2-6.1", "myd11a2-6.1"],
  },
  {
    value: "LST_Night_1km",
    label: "LST - Temperatura Noturna",
    satellites: ["mod11a2-6.1", "myd11a2-6.1"],
  },
];

// Estilos do modal com efeito glassmórfico refinado
const modalStyles = {
  overlay: {
    position: "fixed" as const,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.85)",
    backdropFilter: "blur(15px)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 2000,
    animation: "fadeIn 0.4s ease-out",
  },
  container: {
    background:
      "linear-gradient(135deg, rgba(26, 26, 26, 0.95) 0%, rgba(42, 42, 42, 0.85) 50%, rgba(26, 26, 26, 0.95) 100%)",
    backdropFilter: "blur(25px)",
    border: "1px solid rgba(255, 255, 255, 0.15)",
    borderRadius: "24px",
    padding: "32px",
    maxWidth: "95vw",
    width: "95vw",
    maxHeight: "90vh",
    height: "90vh",
    overflow: "hidden",
    color: "white",
    fontFamily: "system-ui, Avenir, Helvetica, Arial, sans-serif",
    boxShadow: `
      0 32px 64px -12px rgba(0, 0, 0, 0.8),
      0 0 0 1px rgba(255, 255, 255, 0.08),
      inset 0 1px 0 rgba(255, 255, 255, 0.1)
    `,
    animation: "fadeIn 0.5s cubic-bezier(0.4, 0, 0.2, 1)",
    display: "flex",
    flexDirection: "column" as const,
  },
  section: {
    background:
      "linear-gradient(135deg, rgba(42, 42, 42, 0.7) 0%, rgba(26, 26, 26, 0.9) 100%)",
    backdropFilter: "blur(15px)",
    padding: "20px",
    borderRadius: "16px",
    border: "1px solid rgba(255, 255, 255, 0.12)",
    boxShadow: `
      0 8px 32px rgba(0, 0, 0, 0.4),
      inset 0 1px 0 rgba(255, 255, 255, 0.1)
    `,
    position: "relative" as const,
    overflow: "hidden",
  },
  kpiCard: {
    background:
      "linear-gradient(135deg, rgba(42, 42, 42, 0.8) 0%, rgba(26, 26, 26, 0.9) 100%)",
    backdropFilter: "blur(10px)",
    padding: "20px",
    borderRadius: "16px",
    border: "1px solid rgba(255, 255, 255, 0.1)",
    textAlign: "center" as const,
    position: "relative" as const,
    overflow: "hidden",
    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
    cursor: "default",
  },
};

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  data,
  coordinates,
  loading,
  error,
  onFiltersChange,
}) => {
  const [filters, setFilters] = useState<FilterParams>({
    satellite: "S2-16D-2", // ✅ Sentinel-2 (melhor cobertura)
    variable: "NDVI", // ✅ Maiúsculo
    startDate: "2025-01-01", // ✅ Data recente
    endDate: new Date().toISOString().split("T")[0], // Data atual
  });

  const [showFilters, setShowFilters] = useState(false);
  const [locationInfo, setLocationInfo] = useState<LocationInfo | null>(null);

  // Função para buscar informações da cidade
  const fetchLocationInfo = async (lat: number, lng: number) => {
    setLocationInfo({ city: "", country: "", loading: true });

    try {
      // Usando OpenStreetMap Nominatim (gratuito, sem API key)
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&accept-language=pt-BR,pt,en`
      );

      if (!response.ok) {
        throw new Error("Erro na geocodificação");
      }

      const data = await response.json();

      // Extrair informações da resposta
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

      setLocationInfo({
        city,
        state,
        country,
        loading: false,
      });
    } catch (error) {
      console.error("Erro ao buscar informações da localização:", error);
      setLocationInfo({
        city: "Localização não encontrada",
        country: "",
        loading: false,
      });
    }
  };

  // Effect para buscar localização quando coordenadas mudarem
  useEffect(() => {
    if (coordinates && isOpen) {
      fetchLocationInfo(coordinates.lat, coordinates.lng);
    }
  }, [coordinates, isOpen]);

  // Adicionar CSS para animação do loading
  useEffect(() => {
    const style = document.createElement("style");
    style.textContent = `
      @keyframes spin {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
      }
    `;
    document.head.appendChild(style);

    return () => {
      if (document.head.contains(style)) {
        document.head.removeChild(style);
      }
    };
  }, []);

  const handleFilterChange = (key: keyof FilterParams, value: string) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
  };

  const applyFilters = () => {
    onFiltersChange(filters);
    setShowFilters(false);
  };

  const resetFilters = () => {
    const defaultFilters = {
      satellite: "S2-16D-2", // ✅ Sentinel-2
      variable: "NDVI", // ✅ Maiúsculo
      startDate: "2024-01-01", // ✅ Data recente
      endDate: "2024-10-01",
    };
    setFilters(defaultFilters);
    onFiltersChange(defaultFilters);
  };

  // Adicione este useEffect para atualizar variáveis disponíveis
  useEffect(() => {
    const selectedSatellite = filters.satellite;
    const availableVariables = variableOptions.filter((v) =>
      v.satellites.includes(selectedSatellite)
    );

    // Se a variável atual não está disponível para o satélite selecionado
    if (!availableVariables.some((v) => v.value === filters.variable)) {
      // Muda para a primeira variável disponível
      const newVariable = availableVariables[0]?.value || "NDVI";
      setFilters((prev) => ({ ...prev, variable: newVariable }));
    }
  }, [filters.satellite]);

  if (!isOpen) return null;

  // Preparar dados para o gráfico
  const chartData =
    data?.data.timeline.map((date, index) => ({
      date: new Date(date).toLocaleDateString("pt-BR", {
        month: "short",
        day: "numeric",
      }),
      value: data.data.values[index] || 0,
      fullDate: date,
    })) || [];

  // Calcular estatísticas
  const validValues =
    data?.data.values.filter((v) => v !== null && !Number.isNaN(v)) || [];
  const stats =
    validValues.length > 0
      ? {
          max: Math.max(...validValues),
          min: Math.min(...validValues),
          avg: validValues.reduce((a, b) => a + b, 0) / validValues.length,
        }
      : null;

  return (
    <div style={modalStyles.overlay} onClick={onClose}>
      <div style={modalStyles.container} onClick={(e) => e.stopPropagation()}>
        {/* Header - mantém no topo */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "24px",
            borderBottom: "1px solid rgba(255, 255, 255, 0.12)",
            paddingBottom: "16px",
            flexShrink: 0,
          }}
        >
          {/* Conteúdo do header existente... */}
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <div
              style={{
                background: "linear-gradient(135deg, #007cbf 0%, #005a8b 100%)",
                padding: "10px",
                borderRadius: "12px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 6px 20px rgba(0, 124, 191, 0.3)",
              }}
            >
              <Satellite size={24} color="white" />
            </div>
            <div>
              <h2
                style={{
                  margin: 0,
                  fontSize: "24px",
                  background:
                    "linear-gradient(135deg, #007cbf 0%, #00a8ff 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  fontWeight: "bold",
                  letterSpacing: "-0.5px",
                }}
              >
                Análise de Dados dos Satélites
              </h2>
              <p
                style={{
                  margin: "4px 0 0 0",
                  fontSize: "13px",
                  color: "rgba(255, 255, 255, 0.7)",
                  fontWeight: "500",
                }}
              >
                {
                  satelliteOptions.find((s) => s.value === filters.satellite)
                    ?.label
                }{" "}
                •{" "}
                {
                  variableOptions.find((v) => v.value === filters.variable)
                    ?.label
                }
              </p>
            </div>
          </div>

          <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
            {/* Botões do header... */}
            <button
              type="button"
              onClick={() => setShowFilters(!showFilters)}
              style={{
                background: showFilters
                  ? "linear-gradient(135deg, #007cbf 0%, #005a8b 100%)"
                  : "rgba(255, 255, 255, 0.1)",
                backdropFilter: "blur(10px)",
                border: `1px solid ${
                  showFilters
                    ? "rgba(0, 124, 191, 0.4)"
                    : "rgba(255, 255, 255, 0.2)"
                }`,
                color: showFilters ? "white" : "#cccccc",
                cursor: "pointer",
                padding: "10px 14px",
                borderRadius: "10px",
                display: "flex",
                alignItems: "center",
                gap: "6px",
                fontSize: "13px",
                fontWeight: "500",
                transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
              }}
            >
              <Filter size={16} />
              Filtros
            </button>

            <button
              type="button"
              onClick={onClose}
              style={{
                background: "rgba(255, 255, 255, 0.1)",
                backdropFilter: "blur(10px)",
                border: "1px solid rgba(255, 255, 255, 0.2)",
                color: "#cccccc",
                cursor: "pointer",
                padding: "10px",
                borderRadius: "10px",
                display: "flex",
                alignItems: "center",
                transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "rgba(220, 53, 69, 0.2)";
                e.currentTarget.style.borderColor = "rgba(220, 53, 69, 0.4)";
                e.currentTarget.style.transform = "scale(1.05)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "rgba(255, 255, 255, 0.1)";
                e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.2)";
                e.currentTarget.style.transform = "scale(1)";
              }}
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Painel de Filtros - se expandido */}
        {showFilters && (
          <div
            style={{
              ...modalStyles.section,
              marginBottom: "16px",
              background:
                "linear-gradient(135deg, rgba(0, 124, 191, 0.1) 0%, rgba(26, 26, 26, 0.9) 100%)",
              border: "1px solid rgba(0, 124, 191, 0.2)",
              flexShrink: 0,
            }}
          >
            {/* Conteúdo dos filtros compacto */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                marginBottom: "16px",
              }}
            >
              <div
                style={{
                  background:
                    "linear-gradient(135deg, #007cbf 0%, #005a8b 100%)",
                  padding: "6px",
                  borderRadius: "8px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Filter size={16} color="white" />
              </div>
              <h3
                style={{
                  margin: 0,
                  fontSize: "16px",
                  color: "#007cbf",
                  fontWeight: "600",
                }}
              >
                Configurar Análise
              </h3>
            </div>

            <div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
              {/* Filtros em linha horizontal */}
              <div style={{ flex: "1" }}>
                <label
                  style={{
                    display: "block",
                    fontSize: "12px",
                    color: "rgba(255, 255, 255, 0.8)",
                    marginBottom: "4px",
                    fontWeight: "500",
                  }}
                >
                  Satélite
                </label>
                <select
                  value={filters.satellite}
                  onChange={(e) =>
                    handleFilterChange("satellite", e.target.value)
                  }
                  title={
                    satelliteOptions.find((s) => s.value === filters.satellite)
                      ?.description
                  }
                  style={{
                    width: "100%",
                    padding: "8px 12px",
                    backgroundColor: "rgba(42, 42, 42, 0.8)",
                    border: "1px solid rgba(255, 255, 255, 0.2)",
                    borderRadius: "6px",
                    color: "white",
                    fontSize: "13px",
                    outline: "none",
                    cursor: "pointer",
                  }}
                >
                  {satelliteOptions.map((option) => (
                    <option
                      key={option.value}
                      value={option.value}
                      style={{ backgroundColor: "#2a2a2a" }}
                    >
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              <div style={{ flex: "1" }}>
                <label
                  style={{
                    display: "block",
                    fontSize: "12px",
                    color: "rgba(255, 255, 255, 0.8)",
                    marginBottom: "4px",
                    fontWeight: "500",
                  }}
                >
                  Variável
                </label>
                <select
                  value={filters.variable}
                  onChange={(e) =>
                    handleFilterChange("variable", e.target.value)
                  }
                  style={{
                    width: "100%",
                    padding: "8px 12px",
                    backgroundColor: "rgba(42, 42, 42, 0.8)",
                    border: "1px solid rgba(255, 255, 255, 0.2)",
                    borderRadius: "6px",
                    color: "white",
                    fontSize: "13px",
                    outline: "none",
                    cursor: "pointer",
                  }}
                >
                  {variableOptions.map((option) => (
                    <option
                      key={option.value}
                      value={option.value}
                      style={{ backgroundColor: "#2a2a2a" }}
                    >
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              <div style={{ flex: "1" }}>
                <label
                  style={{
                    display: "block",
                    fontSize: "12px",
                    color: "rgba(255, 255, 255, 0.8)",
                    marginBottom: "4px",
                    fontWeight: "500",
                  }}
                >
                  Data Inicial
                </label>
                <input
                  type="date"
                  value={filters.startDate}
                  onChange={(e) =>
                    handleFilterChange("startDate", e.target.value)
                  }
                  style={{
                    width: "80%",
                    padding: "8px 12px",
                    backgroundColor: "rgba(42, 42, 42, 0.8)",
                    border: "1px solid rgba(255, 255, 255, 0.2)",
                    borderRadius: "6px",
                    color: "white",
                    fontSize: "13px",
                    outline: "none",
                    cursor: "pointer",
                  }}
                />
              </div>

              <div style={{ flex: "1" }}>
                <label
                  style={{
                    display: "block",
                    fontSize: "12px",
                    color: "rgba(255, 255, 255, 0.8)",
                    marginBottom: "4px",
                    fontWeight: "500",
                  }}
                >
                  Data Final
                </label>
                <input
                  type="date"
                  value={filters.endDate}
                  onChange={(e) =>
                    handleFilterChange("endDate", e.target.value)
                  }
                  style={{
                    width: "80%",
                    padding: "8px 12px",
                    backgroundColor: "rgba(42, 42, 42, 0.8)",
                    border: "1px solid rgba(255, 255, 255, 0.2)",
                    borderRadius: "6px",
                    color: "white",
                    fontSize: "13px",
                    outline: "none",
                    cursor: "pointer",
                  }}
                />
              </div>

              <div style={{ display: "flex", gap: "8px", paddingTop: "18px" }}>
                <button
                  type="button"
                  onClick={resetFilters}
                  style={{
                    background: "rgba(255, 255, 255, 0.1)",
                    border: "1px solid rgba(255, 255, 255, 0.2)",
                    color: "#cccccc",
                    cursor: "pointer",
                    padding: "8px 12px",
                    borderRadius: "6px",
                    display: "flex",
                    alignItems: "center",
                    gap: "4px",
                    fontSize: "12px",
                    fontWeight: "500",
                    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                  }}
                >
                  <RefreshCw size={14} />
                  Reset
                </button>

                <button
                  type="button"
                  onClick={applyFilters}
                  style={{
                    background:
                      "linear-gradient(135deg, #007cbf 0%, #005a8b 100%)",
                    border: "1px solid rgba(0, 124, 191, 0.3)",
                    color: "white",
                    cursor: "pointer",
                    padding: "8px 16px",
                    borderRadius: "6px",
                    display: "flex",
                    alignItems: "center",
                    gap: "4px",
                    fontSize: "12px",
                    fontWeight: "600",
                    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                    boxShadow: "0 2px 8px rgba(0, 124, 191, 0.3)",
                  }}
                >
                  <Calendar size={14} />
                  Aplicar
                </button>
              </div>
            </div>
          </div>
        )}

        {/* CONTEÚDO PRINCIPAL EM LAYOUT HORIZONTAL */}
        <div
          style={{
            display: "flex",
            gap: "20px",
            height: "80%",
            overflow: "hidden",
            flex: 1,
          }}
        >
          {/* COLUNA ESQUERDA - Informações e Interpretação */}
          <div
            style={{
              width: "380px",
              height: "100%",
              display: "flex",
              flexDirection: "column",
              gap: "16px",
              flexShrink: 0,
            }}
          >
            {/* Loading */}
            {loading && (
              <div
                style={{
                  ...modalStyles.section,
                  textAlign: "center",
                  padding: "40px 20px",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: "16px",
                  }}
                >
                  <div
                    style={{
                      background:
                        "linear-gradient(135deg, #007cbf 0%, #005a8b 100%)",
                      padding: "16px",
                      borderRadius: "50%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      boxShadow: "0 6px 24px rgba(0, 124, 191, 0.3)",
                    }}
                  >
                    <Loader2 size={32} color="white" className="spin" />
                  </div>
                  <div>
                    <div
                      style={{
                        color: "white",
                        fontSize: "16px",
                        fontWeight: "600",
                        marginBottom: "6px",
                      }}
                    >
                      Processando Dados
                    </div>
                    <div
                      style={{
                        color: "rgba(255, 255, 255, 0.7)",
                        fontSize: "12px",
                        lineHeight: "1.4",
                      }}
                    >
                      {
                        satelliteOptions.find(
                          (s) => s.value === filters.satellite
                        )?.label
                      }{" "}
                      •{" "}
                      {
                        variableOptions.find(
                          (v) => v.value === filters.variable
                        )?.label
                      }
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Error */}
            {error && (
              <div
                style={{
                  ...modalStyles.section,
                  background:
                    "linear-gradient(135deg, rgba(220, 53, 69, 0.15) 0%, rgba(26, 26, 26, 0.9) 100%)",
                  border: "1px solid rgba(220, 53, 69, 0.3)",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: "12px",
                  }}
                >
                  <div
                    style={{
                      background: "rgba(220, 53, 69, 0.2)",
                      padding: "8px",
                      borderRadius: "8px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    <X size={20} color="#ff6b6b" />
                  </div>
                  <div style={{ flex: 1 }}>
                    <h3
                      style={{
                        margin: "0 0 8px 0",
                        fontSize: "16px",
                        color: "#ff6b6b",
                        fontWeight: "600",
                      }}
                    >
                      Erro na Consulta
                    </h3>
                    <div
                      style={{
                        color: "rgba(255, 255, 255, 0.9)",
                        lineHeight: "1.4",
                        fontSize: "13px",
                      }}
                    >
                      {error}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Coordenadas com nome da cidade - VERSÃO ULTRA COMPACTA */}
            {coordinates && (
              <div
                style={{
                  ...modalStyles.section,
                  transition: "all 0.3s ease",
                  overflow: "hidden",
                  padding: "8px 12px", // ✅ Reduzido de 12px 16px
                }}
              >
                {!showFilters && (
                  <>
                    {/* Linha única com ícone, cidade e coordenadas */}
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                      }}
                    >
                      {/* Ícone + Cidade */}
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "6px",
                          flex: 1,
                          minWidth: 0,
                        }}
                      >
                        <div
                          style={{
                            background:
                              "linear-gradient(135deg, #007cbf 0%, #005a8b 100%)",
                            padding: "4px",
                            borderRadius: "4px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            flexShrink: 0,
                          }}
                        >
                          <MapPin size={12} color="white" />
                        </div>

                        {locationInfo?.loading ? (
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "4px",
                            }}
                          >
                            <Loader2
                              size={10}
                              color="#007cbf"
                              style={{
                                animation: "spin 1s linear infinite",
                              }}
                            />
                            <span
                              style={{
                                fontSize: "10px",
                                color: "rgba(255, 255, 255, 0.6)",
                              }}
                            >
                              Carregando...
                            </span>
                          </div>
                        ) : (
                          <div
                            style={{
                              flex: 1,
                              minWidth: 0,
                              overflow: "hidden",
                            }}
                          >
                            <div
                              style={{
                                fontSize: "12px",
                                fontWeight: "600",
                                color: "#007cbf",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                whiteSpace: "nowrap",
                              }}
                            >
                              {locationInfo?.city}
                            </div>
                            {locationInfo?.state && (
                              <div
                                style={{
                                  fontSize: "9px",
                                  color: "rgba(255, 255, 255, 0.5)",
                                  overflow: "hidden",
                                  textOverflow: "ellipsis",
                                  whiteSpace: "nowrap",
                                }}
                              >
                                {locationInfo.state}
                              </div>
                            )}
                          </div>
                        )}
                      </div>

                      {/* Coordenadas inline */}
                      <div
                        style={{
                          display: "flex",
                          gap: "6px",
                          flexShrink: 0,
                        }}
                      >
                        <div
                          style={{
                            background: "rgba(42, 42, 42, 0.6)",
                            padding: "4px 8px",
                            borderRadius: "4px",
                            border: "1px solid rgba(255, 255, 255, 0.1)",
                          }}
                        >
                          <div
                            style={{
                              fontSize: "10px",
                              fontFamily: "monospace",
                              color: "#007cbf",
                              fontWeight: "bold",
                            }}
                          >
                            {coordinates.lat.toFixed(3)}°
                          </div>
                        </div>

                        <div
                          style={{
                            background: "rgba(42, 42, 42, 0.6)",
                            padding: "4px 8px",
                            borderRadius: "4px",
                            border: "1px solid rgba(255, 255, 255, 0.1)",
                          }}
                        >
                          <div
                            style={{
                              fontSize: "10px",
                              fontFamily: "monospace",
                              color: "#007cbf",
                              fontWeight: "bold",
                            }}
                          >
                            {coordinates.lng.toFixed(3)}°
                          </div>
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>
            )}

            {/* ✅ INTERPRETAÇÃO - MAIOR E COM 2 COLUNAS */}
            {data?.success && !showFilters && (
              <div
                style={{
                  ...modalStyles.section,
                  flex: 1, // ✅ Ocupa todo o espaço restante
                  display: "flex",
                  flexDirection: "column",
                  minHeight: 0, // ✅ Permite scroll
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    marginBottom: "12px",
                    flexShrink: 0,
                  }}
                >
                  <div
                    style={{
                      background:
                        "linear-gradient(135deg, #007cbf 0%, #005a8b 100%)",
                      padding: "6px",
                      borderRadius: "8px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <BarChart3 size={16} color="white" />
                  </div>
                  <h3
                    style={{
                      margin: 0,
                      fontSize: "16px",
                      color: "#007cbf",
                      fontWeight: "600",
                    }}
                  >
                    Interpretação
                  </h3>
                </div>

                {/* NDVI - 2 COLUNAS */}
                {data.data.metadata.variable === "NDVI" && (
                  <div
                    style={{
                      flex: 1,
                      overflow: "auto",
                      paddingRight: "4px", // ✅ Espaço para scrollbar
                    }}
                  >
                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns: "1fr 1fr",
                        gap: "8px",
                      }}
                    >
                      {/* Água/Solo */}
                      <div
                        style={{
                          padding: "10px 12px",
                          background: "rgba(42, 42, 42, 0.6)",
                          borderRadius: "8px",
                          border: "1px solid rgba(255, 255, 255, 0.1)",
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "8px",
                            marginBottom: "4px",
                          }}
                        >
                          <span style={{ fontSize: "18px" }}>💧</span>
                          <div>
                            <div
                              style={{
                                fontSize: "13px",
                                color: "white",
                                fontWeight: "600",
                              }}
                            >
                              Água/Solo Exposto
                            </div>
                            <div
                              style={{
                                fontSize: "10px",
                                color: "rgba(255, 255, 255, 0.6)",
                              }}
                            >
                              -1.0 a 0.1
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Vegetação Esparsa */}
                      <div
                        style={{
                          padding: "10px 12px",
                          background: "rgba(42, 42, 42, 0.6)",
                          borderRadius: "8px",
                          border: "1px solid rgba(255, 255, 255, 0.1)",
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "8px",
                            marginBottom: "4px",
                          }}
                        >
                          <span style={{ fontSize: "18px" }}>🌾</span>
                          <div>
                            <div
                              style={{
                                fontSize: "13px",
                                color: "white",
                                fontWeight: "600",
                              }}
                            >
                              Vegetação Esparsa
                            </div>
                            <div
                              style={{
                                fontSize: "10px",
                                color: "rgba(255, 255, 255, 0.6)",
                              }}
                            >
                              0.1 a 0.3
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Vegetação Moderada */}
                      <div
                        style={{
                          padding: "10px 12px",
                          background: "rgba(42, 42, 42, 0.6)",
                          borderRadius: "8px",
                          border: "1px solid rgba(255, 255, 255, 0.1)",
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "8px",
                            marginBottom: "4px",
                          }}
                        >
                          <span style={{ fontSize: "18px" }}>🌿</span>
                          <div>
                            <div
                              style={{
                                fontSize: "13px",
                                color: "white",
                                fontWeight: "600",
                              }}
                            >
                              Vegetação Moderada
                            </div>
                            <div
                              style={{
                                fontSize: "10px",
                                color: "rgba(255, 255, 255, 0.6)",
                              }}
                            >
                              0.3 a 0.5
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Vegetação Densa */}
                      <div
                        style={{
                          padding: "10px 12px",
                          background: "rgba(42, 42, 42, 0.6)",
                          borderRadius: "8px",
                          border: "1px solid rgba(255, 255, 255, 0.1)",
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "8px",
                            marginBottom: "4px",
                          }}
                        >
                          <span style={{ fontSize: "18px" }}>🌳</span>
                          <div>
                            <div
                              style={{
                                fontSize: "13px",
                                color: "white",
                                fontWeight: "600",
                              }}
                            >
                              Vegetação Densa
                            </div>
                            <div
                              style={{
                                fontSize: "10px",
                                color: "rgba(255, 255, 255, 0.6)",
                              }}
                            >
                              0.5 a 0.7
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Floresta */}
                      <div
                        style={{
                          padding: "10px 12px",
                          background: "rgba(42, 42, 42, 0.6)",
                          borderRadius: "8px",
                          border: "1px solid rgba(255, 255, 255, 0.1)",
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "8px",
                            marginBottom: "4px",
                          }}
                        >
                          <span style={{ fontSize: "18px" }}>🌲</span>
                          <div>
                            <div
                              style={{
                                fontSize: "13px",
                                color: "white",
                                fontWeight: "600",
                              }}
                            >
                              Floresta Tropical
                            </div>
                            <div
                              style={{
                                fontSize: "10px",
                                color: "rgba(255, 255, 255, 0.6)",
                              }}
                            >
                              0.7 a 1.0
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Sua Área */}
                      {stats && (
                        <div
                          style={{
                            padding: "10px 12px",
                            background:
                              "linear-gradient(135deg, rgba(0, 124, 191, 0.2) 0%, rgba(0, 124, 191, 0.1) 100%)",
                            borderRadius: "8px",
                            border: "1px solid rgba(0, 124, 191, 0.3)",
                          }}
                        >
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "8px",
                            }}
                          >
                            <span style={{ fontSize: "24px" }}>
                              {stats.avg >= 0.7
                                ? "🌲"
                                : stats.avg >= 0.5
                                ? "🌳"
                                : stats.avg >= 0.3
                                ? "🌿"
                                : stats.avg >= 0.1
                                ? "🌾"
                                : "💧"}
                            </span>
                            <div style={{ flex: 1 }}>
                              <div
                                style={{
                                  fontSize: "10px",
                                  color: "#007cbf",
                                  fontWeight: "600",
                                  marginBottom: "2px",
                                }}
                              >
                                📍 SUA ÁREA
                              </div>
                              <div
                                style={{
                                  fontSize: "16px",
                                  color: "#007cbf",
                                  fontWeight: "700",
                                  marginBottom: "1px",
                                }}
                              >
                                {stats.avg.toFixed(3)}
                              </div>
                              <div
                                style={{
                                  fontSize: "10px",
                                  color: "rgba(255, 255, 255, 0.7)",
                                  lineHeight: "1.2",
                                }}
                              >
                                {stats.avg >= 0.7
                                  ? "Floresta"
                                  : stats.avg >= 0.5
                                  ? "Veg. Densa"
                                  : stats.avg >= 0.3
                                  ? "Veg. Moderada"
                                  : stats.avg >= 0.1
                                  ? "Veg. Esparsa"
                                  : "Água/Solo"}
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* EVI, NDWI, LST permanecem iguais... */}
                {/* ...existing code... */}
              </div>
            )}
          </div>

          {/* COLUNA DIREITA - Gráfico  */}
          {data?.success && (
            <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
              <div
                style={{
                  ...modalStyles.section,
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    marginBottom: "16px",
                    flexShrink: 0,
                  }}
                >
                  <div
                    style={{
                      background:
                        "linear-gradient(135deg, #007cbf 0%, #005a8b 100%)",
                      padding: "6px",
                      borderRadius: "8px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <TrendingUp size={16} color="white" />
                  </div>
                  <div>
                    <h3
                      style={{
                        margin: 0,
                        fontSize: "18px",
                        color: "#007cbf",
                        fontWeight: "600",
                      }}
                    >
                      Série Temporal - {data.data.metadata.variable}
                    </h3>
                    <p
                      style={{
                        margin: "2px 0 0 0",
                        fontSize: "12px",
                        color: "rgba(255, 255, 255, 0.7)",
                      }}
                    >
                      {data.data.metadata.collection} •{" "}
                      {data.data.metadata.resolution}
                    </p>
                  </div>
                </div>

                <div style={{ flex: 1, minHeight: 0 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={chartData}
                      margin={{ top: 10, right: 20, left: 10, bottom: 10 }}
                    >
                      <CartesianGrid
                        strokeDasharray="2 4"
                        stroke="rgba(255, 255, 255, 0.08)"
                        horizontal={true}
                        vertical={false}
                      />
                      <XAxis
                        dataKey="date"
                        stroke="rgba(255, 255, 255, 0.6)"
                        fontSize={11}
                        tick={{ fill: "rgba(255, 255, 255, 0.6)" }}
                        axisLine={{ stroke: "rgba(255, 255, 255, 0.2)" }}
                        tickLine={{ stroke: "rgba(255, 255, 255, 0.2)" }}
                      />
                      <YAxis
                        stroke="rgba(255, 255, 255, 0.6)"
                        fontSize={11}
                        tick={{ fill: "rgba(255, 255, 255, 0.6)" }}
                        axisLine={{ stroke: "rgba(255, 255, 255, 0.2)" }}
                        tickLine={{ stroke: "rgba(255, 255, 255, 0.2)" }}
                        domain={["dataMin - 0.02", "dataMax + 0.02"]}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "rgba(26, 26, 26, 0.98)",
                          border: "1px solid rgba(0, 124, 191, 0.3)",
                          borderRadius: "8px",
                          backdropFilter: "blur(20px)",
                          color: "white",
                          boxShadow: "0 6px 24px rgba(0, 0, 0, 0.6)",
                          fontSize: "12px",
                        }}
                        labelStyle={{ color: "#007cbf", fontWeight: "bold" }}
                        itemStyle={{ color: "white" }}
                      />
                      <Line
                        type="monotone"
                        dataKey="value"
                        stroke="url(#gradient)"
                        strokeWidth={3}
                        dot={{
                          fill: "#007cbf",
                          strokeWidth: 2,
                          r: 4,
                          stroke: "white",
                        }}
                        activeDot={{
                          r: 6,
                          stroke: "#007cbf",
                          strokeWidth: 2,
                          fill: "white",
                        }}
                      />
                      <defs>
                        <linearGradient
                          id="gradient"
                          x1="0%"
                          y1="0%"
                          x2="100%"
                          y2="0%"
                        >
                          <stop offset="0%" stopColor="#007cbf" />
                          <stop offset="50%" stopColor="#00a8ff" />
                          <stop offset="100%" stopColor="#007cbf" />
                        </linearGradient>
                      </defs>
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer compacto */}
        <div
          style={{
            marginTop: "10px",
            paddingTop: "8px",
            borderTop: "1px solid rgba(255, 255, 255, 0.12)",
            color: "rgba(255, 255, 255, 0.6)",
            fontSize: "11px",
            textAlign: "center",
            flexShrink: 0,
          }}
        >
          SkyHawk API
        </div>
      </div>
    </div>
  );
};

export default Modal;
