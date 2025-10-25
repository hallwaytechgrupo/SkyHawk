import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { modalStyles } from "./styles";
import { variableLabels } from "./constants";
import { applyScaleFactor, formatTooltipValue } from "./utils";
import type { ChartDataPoint } from "./types";

interface ComparisonChartCardProps {
  variable: string;
  data1: ChartDataPoint[];
  data2: ChartDataPoint[];
  satellite1Name: string;
  satellite2Name: string;
}

export const ComparisonChartCard: React.FC<ComparisonChartCardProps> = ({
  variable,
  data1,
  data2,
  satellite1Name,
  satellite2Name,
}) => {
  // ✅ ATUALIZADO: Manter zeros (0 ao invés de null)
  const combinedData = data1.map((point, index) => {
    const value1 = applyScaleFactor(point.value, variable);
    const value2 = data2[index]
      ? applyScaleFactor(data2[index].value, variable)
      : 0;

    return {
      date: point.date,
      [satellite1Name]: value1, // Pode ser 0
      [satellite2Name]: value2, // Pode ser 0
      raw1: point.value,
      raw2: data2[index]?.value || 0,
    };
  });

  const validCount1 = combinedData.filter(
    (p) => p[satellite1Name] !== 0
  ).length;
  const validCount2 = combinedData.filter(
    (p) => p[satellite2Name] !== 0
  ).length;

  return (
    <div
      style={{
        ...modalStyles.section,
        padding: "16px",
        display: "flex",
        flexDirection: "column",
        minHeight: "350px",
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "12px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <div
            style={{
              width: "3px",
              height: "20px",
              borderRadius: "2px",
              background: "linear-gradient(135deg, #9c27b0 0%, #2196f3 100%)",
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
            {variableLabels[variable]} - Comparação
          </h3>
        </div>

        <div
          style={{
            fontSize: "10px",
            color: "rgba(255, 255, 255, 0.5)",
            background: "rgba(156, 39, 176, 0.2)",
            padding: "2px 8px",
            borderRadius: "10px",
          }}
        >
          {validCount1} vs {validCount2} pontos
        </div>
      </div>

      {/* Legend */}
      <div
        style={{
          display: "flex",
          gap: "16px",
          marginBottom: "12px",
          fontSize: "11px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <div
            style={{
              width: "12px",
              height: "3px",
              background: "#9c27b0",
              borderRadius: "2px",
            }}
          />
          <span style={{ color: "rgba(255, 255, 255, 0.8)" }}>
            {satellite1Name}
          </span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <div
            style={{
              width: "12px",
              height: "3px",
              background: "#2196f3",
              borderRadius: "2px",
            }}
          />
          <span style={{ color: "rgba(255, 255, 255, 0.8)" }}>
            {satellite2Name}
          </span>
        </div>
      </div>

      {/* Chart */}
      <div style={{ flex: 1, minHeight: 0 }}>
        {validCount1 === 0 && validCount2 === 0 ? (
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
              data={combinedData}
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
                  border: "1px solid rgba(156, 39, 176, 0.4)",
                  borderRadius: "8px",
                  fontSize: "11px",
                }}
                formatter={(
                  value: number,
                  name: string,
                  props: { payload?: { raw1: number; raw2: number } }
                ) => {
                  if (value === 0) {
                    return ["Sem dados", name];
                  }
                  const isFirst = name === satellite1Name;
                  const rawValue = isFirst
                    ? props.payload?.raw1
                    : props.payload?.raw2;
                  return [formatTooltipValue(rawValue || 0, variable), name];
                }}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey={satellite1Name}
                stroke="#9c27b0"
                strokeWidth={2}
                dot={{ fill: "#9c27b0", r: 3 }}
                activeDot={{ r: 5 }}
                connectNulls={true} // ✅ CONECTAR LACUNAS
              />
              <Line
                type="monotone"
                dataKey={satellite2Name}
                stroke="#2196f3"
                strokeWidth={2}
                dot={{ fill: "#2196f3", r: 3 }}
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
