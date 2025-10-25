import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { modalStyles } from "./styles";
import { variableColors, variableLabels } from "./constants";
import { applyScaleFactor, formatTooltipValue } from "./utils";
import type { ChartDataPoint } from "./types";

interface ChartCardProps {
  variable: string;
  chartData: ChartDataPoint[];
}

export const ChartCard: React.FC<ChartCardProps> = ({
  variable,
  chartData,
}) => {
  // ✅ ATUALIZADO: Manter valores zerados (retorna 0 ao invés de filtrar)
  const correctedChartData = chartData.map((point) => {
    const correctedValue = applyScaleFactor(point.value, variable);
    return {
      ...point,
      value: correctedValue, // Pode ser 0
      originalValue: point.value,
    };
  });

  // Contar apenas valores válidos (não-zero) para estatística
  const validPoints = correctedChartData.filter((p) => p.value !== 0).length;

  return (
    <div
      style={{
        ...modalStyles.section,
        padding: "16px",
        display: "flex",
        flexDirection: "column",
        minHeight: "300px",
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          marginBottom: "12px",
        }}
      >
        <div
          style={{
            width: "3px",
            height: "20px",
            borderRadius: "2px",
            background: variableColors[variable] || "#007cbf",
          }}
        />
        <h3
          style={{
            margin: 0,
            fontSize: "14px",
            color: "white",
            fontWeight: "600",
          }}
        >
          {variableLabels[variable]}
        </h3>
        <div
          style={{
            marginLeft: "auto",
            fontSize: "10px",
            color: "rgba(255, 255, 255, 0.5)",
            background: "rgba(0, 124, 191, 0.2)",
            padding: "2px 8px",
            borderRadius: "10px",
          }}
        >
          {validPoints} válidos / {chartData.length} total
        </div>
      </div>

      {/* Chart */}
      <div style={{ flex: 1, minHeight: 0 }}>
        {validPoints === 0 ? (
          <div
            style={{
              height: "100%",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              color: "rgba(255, 255, 255, 0.5)",
            }}
          >
            <div style={{ fontSize: "32px", marginBottom: "8px" }}>📊</div>
            <div style={{ fontSize: "12px" }}>
              Nenhum dado válido disponível
            </div>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={correctedChartData}
              margin={{ top: 5, right: 10, left: -20, bottom: 5 }}
            >
              <CartesianGrid
                strokeDasharray="2 4"
                stroke="rgba(255, 255, 255, 0.08)"
                horizontal={true}
                vertical={false}
              />
              <XAxis
                dataKey="date"
                stroke="rgba(255, 255, 255, 0.4)"
                fontSize={10}
                tick={{ fill: "rgba(255, 255, 255, 0.6)" }}
              />
              <YAxis
                stroke="rgba(255, 255, 255, 0.4)"
                fontSize={10}
                tick={{ fill: "rgba(255, 255, 255, 0.6)" }}
                domain={["auto", "auto"]}
                tickFormatter={(value) => {
                  if (variable.includes("LST")) {
                    return `${value.toFixed(0)}K`;
                  }
                  return value.toFixed(2);
                }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "rgba(26, 26, 26, 0.98)",
                  border: `1px solid ${variableColors[variable]}40`,
                  borderRadius: "8px",
                  fontSize: "11px",
                }}
                formatter={(
                  value: number,
                  name: string,
                  props: { payload?: { originalValue: number } }
                ) => {
                  const originalValue = props.payload?.originalValue ?? value;
                  return [
                    formatTooltipValue(originalValue, variable),
                    variableLabels[variable],
                  ];
                }}
              />
              <Line
                type="monotone"
                dataKey="value"
                stroke={variableColors[variable]}
                strokeWidth={2}
                dot={{ fill: variableColors[variable], r: 3 }}
                activeDot={{ r: 5 }}
                connectNulls={true} // ✅ CONECTAR LACUNAS
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
};
