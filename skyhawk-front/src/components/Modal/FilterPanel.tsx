import React, { useState } from "react";
import { Filter, Calendar, RefreshCw, GitCompare, Info } from "lucide-react";
import { modalStyles } from "./styles";
import { satelliteOptions } from "./constants";
import type { FilterParams } from "./types";

interface FilterPanelProps {
  filters: FilterParams;
  onFilterChange: (key: keyof FilterParams, value: string) => void;
  onApply: () => void;
  onReset: () => void;
  comparisonMode?: boolean;
  onToggleComparison?: () => void;
  satellite2?: string;
  onSatellite2Change?: (satellite: string) => void;
}

// ✅ Componente de Tooltip
const Tooltip: React.FC<{ text: string; children: React.ReactNode }> = ({
  text,
  children,
}) => {
  const [show, setShow] = useState(false);

  return (
    <div
      style={{ position: "relative", display: "inline-flex" }}
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
    >
      {children}
      {show && (
        <div
          style={{
            position: "absolute",
            bottom: "calc(100% + 8px)",
            left: "50%",
            transform: "translateX(-50%)",
            backgroundColor: "rgba(26, 26, 26, 0.98)",
            color: "white",
            padding: "8px 12px",
            borderRadius: "6px",
            fontSize: "11px",
            whiteSpace: "nowrap",
            zIndex: 10000,
            border: "1px solid rgba(255, 255, 255, 0.1)",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.4)",
            pointerEvents: "none",
          }}
        >
          {text}
          <div
            style={{
              position: "absolute",
              top: "100%",
              left: "50%",
              transform: "translateX(-50%)",
              width: 0,
              height: 0,
              borderLeft: "6px solid transparent",
              borderRight: "6px solid transparent",
              borderTop: "6px solid rgba(26, 26, 26, 0.98)",
            }}
          />
        </div>
      )}
    </div>
  );
};

// ✅ Componente de Legenda
const Legend: React.FC<{
  comparisonMode: boolean;
  satellite1: string;
  satellite2?: string;
}> = ({ comparisonMode, satellite1, satellite2 }) => {
  if (!comparisonMode) return null;

  const sat1Name =
    satelliteOptions.find((s) => s.value === satellite1)?.label || satellite1;
  const sat2Name =
    satelliteOptions.find((s) => s.value === satellite2)?.label || satellite2;

  return (
    <div
      style={{
        display: "flex",
        gap: "12px",
        padding: "10px 12px",
        backgroundColor: "rgba(156, 39, 176, 0.08)",
        border: "1px solid rgba(156, 39, 176, 0.2)",
        borderRadius: "8px",
        marginTop: "12px",
        fontSize: "11px",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
        <div
          style={{
            width: "16px",
            height: "3px",
            background: "linear-gradient(90deg, #9c27b0 0%, #ba68c8 100%)",
            borderRadius: "2px",
          }}
        />
        <span style={{ color: "rgba(255, 255, 255, 0.9)", fontWeight: "500" }}>
          {sat1Name}
        </span>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
        <div
          style={{
            width: "16px",
            height: "3px",
            background: "linear-gradient(90deg, #2196f3 0%, #64b5f6 100%)",
            borderRadius: "2px",
          }}
        />
        <span style={{ color: "rgba(255, 255, 255, 0.9)", fontWeight: "500" }}>
          {sat2Name}
        </span>
      </div>

      <div
        style={{
          marginLeft: "auto",
          color: "rgba(255, 255, 255, 0.6)",
          fontSize: "10px",
          display: "flex",
          alignItems: "center",
          gap: "4px",
        }}
      >
        <Info size={12} />
        As cores identificam cada satélite nos gráficos
      </div>
    </div>
  );
};

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

          {/* ✅ Tooltip Informativo */}
          <Tooltip text="Configure os parâmetros da análise temporal ou compare diferentes satélites">
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: "18px",
                height: "18px",
                borderRadius: "50%",
                backgroundColor: "rgba(0, 124, 191, 0.2)",
                cursor: "help",
              }}
            >
              <Info size={12} color="#007cbf" />
            </div>
          </Tooltip>
        </div>

        {/* Botão de Comparação */}
        {onToggleComparison && (
          <Tooltip
            text={
              comparisonMode
                ? "Desativar modo de comparação"
                : "Ativar comparação entre dois satélites"
            }
          >
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
          </Tooltip>
        )}
      </div>

      {/* MODO NORMAL */}
      {!comparisonMode && (
        <div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
          <div style={{ flex: "1" }}>
            <label
              style={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
                fontSize: "12px",
                color: "rgba(255, 255, 255, 0.8)",
                marginBottom: "4px",
                fontWeight: "500",
              }}
            >
              Satélite
              <Tooltip text="Selecione o satélite para análise temporal">
                <Info size={12} color="rgba(255, 255, 255, 0.5)" />
              </Tooltip>
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
                display: "flex",
                alignItems: "center",
                gap: "6px",
                fontSize: "12px",
                color: "rgba(255, 255, 255, 0.8)",
                marginBottom: "4px",
                fontWeight: "500",
              }}
            >
              Data Inicial
              <Tooltip text="Data de início do período de análise">
                <Info size={12} color="rgba(255, 255, 255, 0.5)" />
              </Tooltip>
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
                display: "flex",
                alignItems: "center",
                gap: "6px",
                fontSize: "12px",
                color: "rgba(255, 255, 255, 0.8)",
                marginBottom: "4px",
                fontWeight: "500",
              }}
            >
              Data Final
              <Tooltip text="Data de término do período de análise">
                <Info size={12} color="rgba(255, 255, 255, 0.5)" />
              </Tooltip>
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
            <Tooltip text="Restaurar valores padrão">
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
            </Tooltip>

            <Tooltip text="Aplicar filtros e buscar dados">
              <button
                type="button"
                onClick={onApply}
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
            </Tooltip>
          </div>
        </div>
      )}

      {/* MODO COMPARAÇÃO */}
      {comparisonMode && onSatellite2Change && (
        <div>
          {/* Seleção de Satélites */}
          <div style={{ display: "flex", gap: "16px", marginBottom: "16px" }}>
            <div style={{ flex: 1 }}>
              <label
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  fontSize: "11px",
                  color: "rgba(255, 255, 255, 0.7)",
                  marginBottom: "6px",
                  fontWeight: "500",
                }}
              >
                🛰️ Satélite 1
                <Tooltip text="Primeiro satélite da comparação (linha roxa)">
                  <Info size={10} color="rgba(156, 39, 176, 0.7)" />
                </Tooltip>
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
                    disabled={option.value === satellite2}
                    style={{ backgroundColor: "#2a2a2a" }}
                  >
                    {option.label}
                    {option.value === satellite2 ? " (Satélite 2)" : ""}
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
              <Tooltip text="Comparação entre satélites">
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
                    cursor: "help",
                  }}
                >
                  VS
                </div>
              </Tooltip>
            </div>

            <div style={{ flex: 1 }}>
              <label
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  fontSize: "11px",
                  color: "rgba(255, 255, 255, 0.7)",
                  marginBottom: "6px",
                  fontWeight: "500",
                }}
              >
                🛰️ Satélite 2
                <Tooltip text="Segundo satélite da comparação (linha azul)">
                  <Info size={10} color="rgba(33, 150, 243, 0.7)" />
                </Tooltip>
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
                    disabled={option.value === filters.satellite}
                    style={{ backgroundColor: "#2a2a2a" }}
                  >
                    {option.label}
                    {option.value === filters.satellite ? " (Satélite 1)" : ""}
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
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  fontSize: "12px",
                  color: "rgba(255, 255, 255, 0.8)",
                  marginBottom: "4px",
                  fontWeight: "500",
                }}
              >
                Data Inicial
                <Tooltip text="Data de início para ambos os satélites">
                  <Info size={12} color="rgba(255, 255, 255, 0.5)" />
                </Tooltip>
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
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  fontSize: "12px",
                  color: "rgba(255, 255, 255, 0.8)",
                  marginBottom: "4px",
                  fontWeight: "500",
                }}
              >
                Data Final
                <Tooltip text="Data de término para ambos os satélites">
                  <Info size={12} color="rgba(255, 255, 255, 0.5)" />
                </Tooltip>
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
              <Tooltip text="Restaurar valores padrão">
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
              </Tooltip>

              <Tooltip text="Comparar os dois satélites selecionados">
                <button
                  type="button"
                  onClick={onApply}
                  disabled={filters.satellite === satellite2}
                  style={{
                    background:
                      filters.satellite === satellite2
                        ? "rgba(156, 39, 176, 0.3)"
                        : "linear-gradient(135deg, #9c27b0 0%, #7b1fa2 100%)",
                    border: "1px solid rgba(156, 39, 176, 0.3)",
                    color: "white",
                    cursor:
                      filters.satellite === satellite2
                        ? "not-allowed"
                        : "pointer",
                    padding: "8px 16px",
                    borderRadius: "6px",
                    display: "flex",
                    alignItems: "center",
                    gap: "4px",
                    fontSize: "12px",
                    fontWeight: "600",
                    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                    boxShadow:
                      filters.satellite === satellite2
                        ? "none"
                        : "0 2px 8px rgba(156, 39, 176, 0.3)",
                    opacity: filters.satellite === satellite2 ? 0.5 : 1,
                  }}
                >
                  <GitCompare size={14} />
                  Comparar
                </button>
              </Tooltip>
            </div>
          </div>

          {/* ✅ LEGENDA */}
          <Legend
            comparisonMode={comparisonMode}
            satellite1={filters.satellite}
            satellite2={satellite2}
          />

          {/* ✅ ALERTA quando satélites iguais */}
          {filters.satellite === satellite2 && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                padding: "10px 12px",
                backgroundColor: "rgba(255, 193, 7, 0.1)",
                border: "1px solid rgba(255, 193, 7, 0.3)",
                borderRadius: "8px",
                marginTop: "12px",
                fontSize: "12px",
                color: "rgba(255, 193, 7, 0.9)",
              }}
            >
              <Info size={14} />
              <span>
                Selecione satélites diferentes para realizar a comparação
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
