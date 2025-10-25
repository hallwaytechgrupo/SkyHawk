import React from "react";
import { modalStyles } from "./styles";
import { variableLabels } from "./constants";

interface UnavailablePanelProps {
  unavailableVariables: string[];
}

export const UnavailablePanel: React.FC<UnavailablePanelProps> = ({
  unavailableVariables,
}) => {
  if (unavailableVariables.length === 0) return null;

  return (
    <div
      style={{
        ...modalStyles.section,
        padding: "12px",
        background:
          "linear-gradient(135deg, rgba(255, 193, 7, 0.1) 0%, rgba(26, 26, 26, 0.9) 100%)",
        border: "1px solid rgba(255, 193, 7, 0.3)",
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
        <span style={{ fontSize: "14px" }}>⚠️</span>
        <span
          style={{
            fontSize: "12px",
            color: "#ffc107",
            fontWeight: "600",
          }}
        >
          Dados indisponíveis
        </span>
      </div>
      {unavailableVariables.map((variable) => (
        <div
          key={variable}
          style={{
            fontSize: "11px",
            color: "rgba(255, 255, 255, 0.6)",
            padding: "4px 0",
          }}
        >
          • {variableLabels[variable]}
        </div>
      ))}
    </div>
  );
};
