import React from "react";

interface ScaleCorrectionBadgeProps {
  variable: string;
  hasCorrection: boolean;
}

export const ScaleCorrectionBadge: React.FC<ScaleCorrectionBadgeProps> = ({
  variable,
  hasCorrection,
}) => {
  if (!hasCorrection || !variable.includes("LST")) {
    return null;
  }

  return (
    <div
      style={{
        background: "rgba(33, 150, 243, 0.15)",
        border: "1px solid rgba(33, 150, 243, 0.3)",
        borderRadius: "6px",
        padding: "6px 10px",
        marginBottom: "10px",
        fontSize: "10px",
        color: "#2196f3",
        display: "flex",
        alignItems: "center",
        gap: "6px",
      }}
    >
      <span>ℹ️</span>
      <span>Fator de escala aplicado (×0.02)</span>
    </div>
  );
};
