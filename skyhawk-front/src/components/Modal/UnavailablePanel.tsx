import React from "react";
import { AlertTriangle } from "lucide-react";
import { modalStyles } from "./styles";

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
        backgroundColor: "rgba(255, 152, 0, 0.1)",
        border: "1px solid rgba(255, 152, 0, 0.3)",
        // ✅ REDUZIR PADDING
        padding: "10px 12px",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "6px", // ✅ Reduzir gap
          marginBottom: "8px", // ✅ Reduzir margem
        }}
      >
        <AlertTriangle size={14} color="#ff9800" /> {/* ✅ Ícone menor */}
        <h3
          style={{
            margin: 0,
            fontSize: "11px", // ✅ Fonte menor
            color: "#ff9800",
            fontWeight: "600",
          }}
        >
          Dados indisponíveis
        </h3>
      </div>

      <ul
        style={{
          margin: 0,
          padding: "0 0 0 16px", // ✅ Reduzir padding
          fontSize: "9px", // ✅ Fonte menor
          color: "rgba(255, 255, 255, 0.7)",
          listStyle: "none",
        }}
      >
        {unavailableVariables.map((variable, index) => (
          <li
            key={index}
            style={{
              marginBottom: "4px", // ✅ Reduzir margem
              display: "flex",
              alignItems: "center",
              gap: "6px",
            }}
          >
            <span
              style={{
                width: "4px", // ✅ Ponto menor
                height: "4px",
                backgroundColor: "#ff9800",
                borderRadius: "50%",
                flexShrink: 0,
              }}
            />
            <span>{variable}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};
