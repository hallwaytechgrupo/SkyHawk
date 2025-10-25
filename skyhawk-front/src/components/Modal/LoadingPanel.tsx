import React from "react";
import { Loader2 } from "lucide-react";
import { modalStyles } from "./styles";
import { variableLabels } from "./constants";

interface LoadingPanelProps {
  loadingVariables: Set<string>;
}

export const LoadingPanel: React.FC<LoadingPanelProps> = ({
  loadingVariables,
}) => {
  if (loadingVariables.size === 0) return null;

  return (
    <div
      style={{
        ...modalStyles.section,
        padding: "12px",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          marginBottom: "8px",
        }}
      >
        <Loader2
          size={14}
          color="#007cbf"
          style={{ animation: "spin 1s linear infinite" }}
        />
        <span style={{ fontSize: "12px", color: "#007cbf" }}>
          Carregando variáveis...
        </span>
      </div>
      {Array.from(loadingVariables).map((variable) => (
        <div
          key={variable}
          style={{
            fontSize: "11px",
            color: "rgba(255, 255, 255, 0.7)",
            padding: "4px 0",
          }}
        >
          • {variableLabels[variable]}
        </div>
      ))}
    </div>
  );
};
