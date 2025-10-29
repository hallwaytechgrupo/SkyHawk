import React from "react";
import { Satellite, Filter, X } from "lucide-react";
import { satelliteOptions } from "./constants";

interface ModalHeaderProps {
  satellite: string;
  validCount: number;
  totalCount: number;
  showFilters: boolean;
  onToggleFilters: () => void;
  onClose: () => void;
}

export const ModalHeader: React.FC<ModalHeaderProps> = ({
  satellite,
  validCount,
  totalCount,
  showFilters,
  onToggleFilters,
  onClose,
}) => {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "16px",
        borderBottom: "1px solid rgba(255, 255, 255, 0.12)",
        paddingBottom: "16px",
        flexShrink: 0,
      }}
    >
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
              fontSize: "18px",
              background: "linear-gradient(135deg, #007cbf 0%, #00a8ff 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              fontWeight: "bold",
              letterSpacing: "-0.5px",
            }}
          >
            Análise Multi-Variável
          </h2>
          <p
            style={{
              margin: "4px 0 0 0",
              fontSize: "12px",
              color: "rgba(255, 255, 255, 0.7)",
              fontWeight: "500",
            }}
          >
            {satelliteOptions.find((s) => s.value === satellite)?.label} •{" "}
            {validCount} de {totalCount} variáveis
          </p>
        </div>
      </div>

      <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
        <button
          type="button"
          onClick={onToggleFilters}
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
        >
          <X size={18} />
        </button>
      </div>
    </div>
  );
};
