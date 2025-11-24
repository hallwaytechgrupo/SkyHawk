import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { modalStyles } from "./styles";
import { variableColors, variableLabels } from "./constants";
import { applyScaleFactor } from "./utils";
import type { ChartDataPoint } from "./types";

interface ComparisonChartCardProps {
  variables: string[];
  satellite1Name: string;
  satellite2Name: string;
  data1: Record<string, ChartDataPoint[]>;
  data2: Record<string, ChartDataPoint[]>;
}

export const ComparisonChartCard: React.FC<ComparisonChartCardProps> = ({
  variables,
  satellite1Name,
  satellite2Name,
  data1,
  data2,
}) => {
  // Combina os dados de ambos os satélites em um único array para o gráfico
  const combinedData = React.useMemo(() => {
    interface CombinedDataPoint {
      date: string;
      [key: string]: string | number;
    }
    const dateMap: Record<string, CombinedDataPoint> = {};

    variables.forEach((variable) => {
      // Processa dados do Satélite 1
      (data1[variable] || []).forEach((point) => {
        if (!dateMap[point.date]) {
          dateMap[point.date] = { date: point.date };
        }
        const scaledValue = applyScaleFactor(point.value, variable);
        dateMap[point.date][`${variable}_${satellite1Name}`] = scaledValue;
      });

      // Processa dados do Satélite 2
      (data2[variable] || []).forEach((point) => {
        if (!dateMap[point.date]) {
          dateMap[point.date] = { date: point.date };
        }
        const scaledValue = applyScaleFactor(point.value, variable);
        dateMap[point.date][`${variable}_${satellite2Name}`] = scaledValue;
      });
    });

    return Object.values(dateMap).sort(
      (
        a: { date: string; [key: string]: unknown },
        b: { date: string; [key: string]: unknown }
      ) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );
  }, [variables, data1, data2, satellite1Name, satellite2Name]);

  return (
    <div
      style={{ ...modalStyles.section, padding: "16px", gridColumn: "1 / -1" }}
    >
      <h3
        style={{
          margin: "0 0 12px 0",
          fontSize: "14px",
          color: "white",
          fontWeight: "600",
        }}
      >
        Comparação:{" "}
        {variableLabels[variables.join(", ")] || variables.join(", ")}
      </h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart
          data={combinedData}
          margin={{ top: 5, right: 20, left: -10, bottom: 5 }}
        >
          <CartesianGrid
            strokeDasharray="2 4"
            stroke="rgba(255, 255, 255, 0.1)"
          />
          <XAxis
            dataKey="date"
            stroke="rgba(255, 255, 255, 0.5)"
            fontSize={10}
            tick={{ fill: "rgba(255, 255, 255, 0.6)" }}
          />
          <YAxis
            stroke="rgba(255, 255, 255, 0.5)"
            fontSize={10}
            domain={["auto", "auto"]}
            tickFormatter={(value) => {
              if (variables[0].includes("LST")) {
                return `${value.toFixed(0)}K`;
              }
              return value.toFixed(2);
            }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "rgba(26, 26, 26, 0.9)",
              border: "1px solid rgba(0, 124, 191, 0.4)",
              fontSize: "11px",
            }}
            formatter={(value: number, name: string) => [
              value.toFixed(4),
              name,
            ]}
          />
          <Legend wrapperStyle={{ fontSize: "10px" }} />

          {/* Gera uma linha para cada variável de cada satélite */}
          {variables.map((variable) => (
            <React.Fragment key={variable}>
              <Line
                type="monotone"
                dataKey={`${variable}_${satellite1Name}`}
                name={`${variableLabels[variable]} (${satellite1Name})`}
                stroke={variableColors[variable] || "#8884d8"}
                strokeWidth={2}
                dot={false}
                isAnimationActive={false}
              />
              <Line
                type="monotone"
                dataKey={`${variable}_${satellite2Name}`}
                name={`${variableLabels[variable]} (${satellite2Name})`}
                stroke={variableColors[variable] || "#82ca9d"}
                strokeDasharray="5 5" // Linha tracejada para o segundo satélite
                strokeWidth={2}
                dot={false}
                isAnimationActive={false}
              />
            </React.Fragment>
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};
