import React from "react";
import { Loader2 } from "lucide-react";
import { modalStyles } from "./styles";

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
        backgroundColor: "rgba(33, 150, 243, 0.1)",
        border: "1px solid rgba(33, 150, 243, 0.3)",
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
        <Loader2
          size={14} // ✅ Ícone menor
          color="#2196f3"
          style={{ animation: "spin 1s linear infinite" }}
        />
        <h3
          style={{
            margin: 0,
            fontSize: "11px", // ✅ Fonte menor
            color: "#2196f3",
            fontWeight: "600",
          }}
        >
          Carregando
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
        {Array.from(loadingVariables).map((variable, index) => (
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
                backgroundColor: "#2196f3",
                borderRadius: "50%",
                flexShrink: 0,
                animation: "pulse 1.5s ease-in-out infinite",
              }}
            />
            <span>{variable}</span>
          </li>
        ))}
      </ul>

      <style>
        {`
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
          @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.4; }
          }
        `}
      </style>
    </div>
  );
};
