import React from "react";
import { Filter, Calendar, RefreshCw, GitCompare } from "lucide-react";
import { modalStyles } from "./styles";
import { satelliteOptions } from "./constants";
import type { FilterParams } from "./types";

interface FilterPanelProps {
  filters: FilterParams;
  onFilterChange: (key: keyof FilterParams, value: string) => void;
  onApply: () => void;
  onReset: () => void;
  comparisonMode?: boolean; // ✅ NOVO
  onToggleComparison?: () => void; // ✅ NOVO
  satellite2?: string; // ✅ NOVO
  onSatellite2Change?: (satellite: string) => void; // ✅ NOVO
}

export const FilterPanel: React.FC<FilterPanelProps> = ({
  filters,
  onFilterChange,
  onApply,
  onReset,
  comparisonMode = false,
  onToggleComparison,
  satellite2 = "LANDSAT-16D-1",
  onSatellite2Change,
}) => {
  return (
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
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "16px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div
            style={{
              background: "linear-gradient(135deg, #007cbf 0%, #005a8b 100%)",
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

        {/* ✅ NOVO: Botão de Comparação */}
        {onToggleComparison && (
          <button
            type="button"
            onClick={onToggleComparison}
            style={{
              background: comparisonMode
                ? "linear-gradient(135deg, #9c27b0 0%, #7b1fa2 100%)"
                : "rgba(156, 39, 176, 0.2)",
              border: `1px solid ${
                comparisonMode
                  ? "rgba(156, 39, 176, 0.4)"
                  : "rgba(156, 39, 176, 0.3)"
              }`,
              color: comparisonMode ? "white" : "#9c27b0",
              cursor: "pointer",
              padding: "8px 14px",
              borderRadius: "8px",
              display: "flex",
              alignItems: "center",
              gap: "6px",
              fontSize: "12px",
              fontWeight: "600",
              transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
              boxShadow: comparisonMode
                ? "0 4px 12px rgba(156, 39, 176, 0.3)"
                : "none",
            }}
          >
            <GitCompare size={14} />
            {comparisonMode ? "Comparação Ativa" : "Comparar Satélites"}
          </button>
        )}
      </div>

      {/* ✅ MODO NORMAL */}
      {!comparisonMode && (
        <div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
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
              onChange={(e) => onFilterChange("satellite", e.target.value)}
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
              Data Inicial
            </label>
            <input
              type="date"
              value={filters.startDate}
              onChange={(e) => onFilterChange("startDate", e.target.value)}
              style={{
                width: "90%",
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
              onChange={(e) => onFilterChange("endDate", e.target.value)}
              style={{
                width: "90%",
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
              onClick={onReset}
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
              onClick={onApply}
              style={{
                background: "linear-gradient(135deg, #007cbf 0%, #005a8b 100%)",
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
      )}

      {/* ✅ MODO COMPARAÇÃO */}
      {comparisonMode && onSatellite2Change && (
        <div>
          {/* Seleção de Satélites */}
          <div style={{ display: "flex", gap: "16px", marginBottom: "16px" }}>
            <div style={{ flex: 1 }}>
              <label
                style={{
                  display: "block",
                  fontSize: "11px",
                  color: "rgba(255, 255, 255, 0.7)",
                  marginBottom: "6px",
                  fontWeight: "500",
                }}
              >
                🛰️ Satélite 1
              </label>
              <select
                value={filters.satellite}
                onChange={(e) => onFilterChange("satellite", e.target.value)}
                style={{
                  width: "100%",
                  padding: "10px 12px",
                  backgroundColor: "rgba(156, 39, 176, 0.15)",
                  border: "2px solid rgba(156, 39, 176, 0.4)",
                  borderRadius: "8px",
                  color: "white",
                  fontSize: "13px",
                  fontWeight: "500",
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

            {/* VS Badge */}
            <div
              style={{
                display: "flex",
                alignItems: "flex-end",
                paddingBottom: "10px",
              }}
            >
              <div
                style={{
                  padding: "8px 12px",
                  background:
                    "linear-gradient(135deg, #9c27b0 0%, #7b1fa2 100%)",
                  borderRadius: "8px",
                  fontSize: "12px",
                  fontWeight: "700",
                  color: "white",
                  boxShadow: "0 4px 12px rgba(156, 39, 176, 0.4)",
                }}
              >
                VS
              </div>
            </div>

            <div style={{ flex: 1 }}>
              <label
                style={{
                  display: "block",
                  fontSize: "11px",
                  color: "rgba(255, 255, 255, 0.7)",
                  marginBottom: "6px",
                  fontWeight: "500",
                }}
              >
                🛰️ Satélite 2
              </label>
              <select
                value={satellite2}
                onChange={(e) => onSatellite2Change(e.target.value)}
                style={{
                  width: "100%",
                  padding: "10px 12px",
                  backgroundColor: "rgba(33, 150, 243, 0.15)",
                  border: "2px solid rgba(33, 150, 243, 0.4)",
                  borderRadius: "8px",
                  color: "white",
                  fontSize: "13px",
                  fontWeight: "500",
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
          </div>

          {/* Datas e Ações */}
          <div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
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
                onChange={(e) => onFilterChange("startDate", e.target.value)}
                style={{
                  width: "90%",
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
                onChange={(e) => onFilterChange("endDate", e.target.value)}
                style={{
                  width: "90%",
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
                onClick={onReset}
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
                onClick={onApply}
                style={{
                  background:
                    "linear-gradient(135deg, #9c27b0 0%, #7b1fa2 100%)",
                  border: "1px solid rgba(156, 39, 176, 0.3)",
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
                  boxShadow: "0 2px 8px rgba(156, 39, 176, 0.3)",
                }}
              >
                <GitCompare size={14} />
                Comparar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
