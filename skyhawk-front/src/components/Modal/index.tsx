import React, { useEffect, useState } from "react";
import { modalStyles } from "./styles";
import {
  satelliteVariables,
  DEFAULT_FILTERS,
  satelliteOptions,
} from "./constants";
import { ModalHeader } from "./ModalHeader";
import { FilterPanel } from "./FilterPanel";
import { LocationPanel } from "./LocationPanel";
import { LoadingPanel } from "./LoadingPanel";
import { UnavailablePanel } from "./UnavailablePanel";
import { ChartGrid } from "./ChartGrid";
import { ComparisonGrid } from "./ComparisonGrid";
import { useModalData } from "./hooks/useModalData";
import { useComparisonData } from "./hooks/useComparisonData"; // ✅ NOVO
import type { ModalProps, FilterParams } from "./types";
import type { TimeSeriesData } from "../../services/skyHawkService";

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  data,
  coordinates,
  onFiltersChange,
}) => {
  const [filters, setFilters] = useState<FilterParams>(DEFAULT_FILTERS);
  const [showFilters, setShowFilters] = useState(false);

  // ✅ Estados para comparação
  const [comparisonMode, setComparisonMode] = useState(false);
  const [satellite2, setSatellite2] = useState("LANDSAT-16D-1");

  // Hook para modo normal
  const { multiSeriesData, loadingVariables, locationInfo, fetchAllVariables } =
    useModalData(
      coordinates,
      isOpen && !comparisonMode, // ✅ Só ativo quando NÃO está em comparação
      filters,
      data,
      onFiltersChange
    );

  // ✅ NOVO: Hook para modo comparação
  const {
    data1: comparisonData1,
    data2: comparisonData2,
    loading1: comparisonLoading1,
    loading2: comparisonLoading2,
    fetchComparison,
  } = useComparisonData();

  const fetchBothSatellites = () => {
    if (coordinates) {
      const vars = satelliteVariables[filters.satellite] || [];
      const commonVars = vars.filter((v) =>
        (satelliteVariables[satellite2] || []).includes(v)
      );

      fetchComparison(coordinates, {
        satellite1: filters.satellite,
        satellite2: satellite2,
        variables: commonVars,
        startDate: filters.startDate,
        endDate: filters.endDate,
      });
    }
  };

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
    console.log("🎯 Aplicando filtros:", filters);

    if (comparisonMode) {
      fetchBothSatellites();
    } else {
      fetchAllVariables(filters.satellite);
    }

    setShowFilters(false);
  };

  const resetFilters = () => {
    setFilters(DEFAULT_FILTERS);
    if (!comparisonMode) {
      fetchAllVariables(DEFAULT_FILTERS.satellite);
    }
  };

  const handleComparisonToggle = () => {
    const newMode = !comparisonMode;
    setComparisonMode(newMode);

    if (newMode) {
      // ✅ Garantir que satélite2 seja diferente
      if (satellite2 === filters.satellite) {
        const differentSat = satelliteOptions.find(
          (s) => s.value !== filters.satellite
        )?.value;
        if (differentSat) {
          setSatellite2(differentSat);
        }
      }

      console.log("🔄 Ativando modo comparação...");
      fetchBothSatellites();
    } else {
      console.log("🔄 Voltando ao modo normal...");
      fetchAllVariables(filters.satellite);
    }
  };

  const handleSatellite2Change = (sat: string) => {
    // ✅ Impedir que seja igual ao satélite 1
    if (sat === filters.satellite) {
      console.warn("⚠️ Não é possível comparar o mesmo satélite");
      return;
    }

    setSatellite2(sat);
    if (comparisonMode) {
      setTimeout(() => {
        fetchBothSatellites();
      }, 100);
    }
  };

  if (!isOpen) return null;

  // Obter variáveis disponíveis e válidas
  const availableVariables = satelliteVariables[filters.satellite] || [];
  const validVariables = availableVariables.filter((variable) => {
    const seriesData = multiSeriesData[variable];
    return (
      seriesData?.success &&
      seriesData.data?.timeline?.length > 0 &&
      seriesData.data?.values?.length > 0
    );
  });

  const unavailableVariables = availableVariables.filter(
    (v) => !validVariables.includes(v)
  );

  // ✅ Variáveis em comum (agora usando dados corretos)
  const commonVariables = comparisonMode
    ? (satelliteVariables[filters.satellite] || [])
        .filter((v) => (satelliteVariables[satellite2] || []).includes(v))
        .filter((variable) => {
          const data1 = comparisonData1[variable];
          const data2 = comparisonData2[variable];
          return (
            data1?.success &&
            data2?.success &&
            data1.data?.timeline?.length > 0 &&
            data2.data?.timeline?.length > 0
          );
        })
    : [];

  return (
    <div style={modalStyles.overlay} onClick={onClose}>
      <div style={modalStyles.container} onClick={(e) => e.stopPropagation()}>
        <ModalHeader
          satellite={
            comparisonMode
              ? `Comparação (${commonVariables.length} variáveis)`
              : filters.satellite
          }
          validCount={
            comparisonMode ? commonVariables.length : validVariables.length
          }
          totalCount={
            comparisonMode ? commonVariables.length : availableVariables.length
          }
          showFilters={showFilters}
          onToggleFilters={() => setShowFilters(!showFilters)}
          onClose={onClose}
        />

        {showFilters && (
          <FilterPanel
            filters={filters}
            onFilterChange={handleFilterChange}
            onApply={applyFilters}
            onReset={resetFilters}
            comparisonMode={comparisonMode}
            onToggleComparison={handleComparisonToggle}
            satellite2={satellite2}
            onSatellite2Change={handleSatellite2Change}
          />
        )}

        {/* CONTEÚDO PRINCIPAL */}
        <div
          style={{
            display: "flex",
            gap: "20px",
            height: "calc(100% - 140px)",
            overflow: "hidden",
            flex: 1,
          }}
        >
          {/* COLUNA ESQUERDA */}
          <div
            style={{
              width: "280px",
              height: "100%",
              display: "flex",
              flexDirection: "column",
              gap: "16px",
              flexShrink: 0,
            }}
          >
            {coordinates && (
              <LocationPanel
                coordinates={coordinates}
                locationInfo={locationInfo}
              />
            )}

            <LoadingPanel
              loadingVariables={
                comparisonMode
                  ? new Set([...comparisonLoading1, ...comparisonLoading2])
                  : loadingVariables
              }
            />

            {!comparisonMode && loadingVariables.size === 0 && (
              <UnavailablePanel unavailableVariables={unavailableVariables} />
            )}
          </div>

          {/* COLUNA DIREITA - Grid */}
          <div
            style={{
              flex: 1,
              display: "grid",
              gridTemplateColumns:
                (comparisonMode ? commonVariables : validVariables).length <= 2
                  ? "1fr"
                  : "1fr 1fr",
              gap: "16px",
              overflow: "auto",
              paddingRight: "8px",
            }}
          >
            {comparisonMode ? (
              <ComparisonGrid
                commonVariables={commonVariables}
                satellite1Name={
                  satelliteOptions.find((s) => s.value === filters.satellite)
                    ?.label || filters.satellite
                }
                satellite2Name={
                  satelliteOptions.find((s) => s.value === satellite2)?.label ||
                  satellite2
                }
                data1={
                  Object.fromEntries(
                    Object.entries(comparisonData1).filter(
                      ([, v]) => v !== null
                    )
                  ) as Record<string, TimeSeriesData>
                }
                data2={
                  Object.fromEntries(
                    Object.entries(comparisonData2).filter(
                      ([, v]) => v !== null
                    )
                  ) as Record<string, TimeSeriesData>
                }
              />
            ) : (
              <ChartGrid
                validVariables={validVariables}
                multiSeriesData={multiSeriesData}
                loadingVariables={loadingVariables}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;
