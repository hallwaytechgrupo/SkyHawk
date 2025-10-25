import React from "react";
import { ComparisonChartCard } from "./ComparisonChartCard";
import type { MultiSeriesData } from "./types";

interface ComparisonGridProps {
  commonVariables: string[];
  satellite1Name: string;
  satellite2Name: string;
  data1: MultiSeriesData;
  data2: MultiSeriesData;
}

export const ComparisonGrid: React.FC<ComparisonGridProps> = ({
  commonVariables,
  satellite1Name,
  satellite2Name,
  data1,
  data2,
}) => {
  if (commonVariables.length === 0) {
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
          Nenhuma variável em comum
        </div>
        <div style={{ fontSize: "12px", textAlign: "center" }}>
          Selecione satélites com variáveis compatíveis
        </div>
      </div>
    );
  }

  return (
    <>
      {commonVariables.map((variable) => {
        const seriesData1 = data1[variable];
        const seriesData2 = data2[variable];

        const chartData1 =
          seriesData1?.data?.timeline.map((date, index) => ({
            date: new Date(date).toLocaleDateString("pt-BR", {
              month: "short",
              day: "numeric",
            }),
            value: seriesData1.data.values[index] || 0,
            fullDate: date,
          })) || [];

        const chartData2 =
          seriesData2?.data?.timeline.map((date, index) => ({
            date: new Date(date).toLocaleDateString("pt-BR", {
              month: "short",
              day: "numeric",
            }),
            value: seriesData2.data.values[index] || 0,
            fullDate: date,
          })) || [];

        return (
          <ComparisonChartCard
            key={variable}
            variable={variable}
            data1={chartData1}
            data2={chartData2}
            satellite1Name={satellite1Name}
            satellite2Name={satellite2Name}
          />
        );
      })}
    </>
  );
};
