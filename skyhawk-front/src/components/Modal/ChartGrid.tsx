import React from "react";
import { ChartCard } from "./ChartCard";
import type { MultiSeriesData, ChartDataPoint } from "./types";

interface ChartGridProps {
  validVariables: string[];
  multiSeriesData: MultiSeriesData;
  loadingVariables: Set<string>;
}

export const ChartGrid: React.FC<ChartGridProps> = ({
  validVariables,
  multiSeriesData,
  loadingVariables,
}) => {
  if (validVariables.length === 0 && loadingVariables.size === 0) {
    return (
      <div
        style={{
          gridColumn: "1 / -1",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          height: "100%",
          color: "rgba(255, 255, 255, 0.5)",
        }}
      >
        <div
          style={{
            fontSize: "48px",
            marginBottom: "16px",
            opacity: 0.3,
          }}
        >
          📊
        </div>
        <div style={{ fontSize: "16px", marginBottom: "8px" }}>
          Nenhum dado disponível
        </div>
        <div style={{ fontSize: "12px", textAlign: "center" }}>
          Tente selecionar outro satélite ou período de datas
        </div>
      </div>
    );
  }

  return (
    <>
      {validVariables.map((variable) => {
        const seriesData = multiSeriesData[variable];

        const chartData: ChartDataPoint[] =
          seriesData?.data?.timeline.map((date, index) => ({
            date: new Date(date).toLocaleDateString("pt-BR", {
              month: "short",
              day: "numeric",
            }),
            value: seriesData.data.values[index] ?? 0, // ✅ USAR 0 se undefined
            fullDate: date,
          })) || [];

        return (
          <ChartCard key={variable} variable={variable} chartData={chartData} />
        );
      })}
    </>
  );
};
