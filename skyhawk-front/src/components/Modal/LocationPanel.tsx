import React from "react";
import { MapPin, Loader2 } from "lucide-react";
import { modalStyles } from "./styles";
import type { LocationInfo } from "./types";

interface LocationPanelProps {
  coordinates: { lat: number; lng: number };
  locationInfo: LocationInfo | null;
}

export const LocationPanel: React.FC<LocationPanelProps> = ({
  coordinates,
  locationInfo,
}) => {
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
        <MapPin size={14} color="#007cbf" />
        <h3
          style={{
            margin: 0,
            fontSize: "13px",
            color: "#007cbf",
            fontWeight: "600",
          }}
        >
          Localização
        </h3>
      </div>

      {locationInfo?.loading ? (
        <div style={{ textAlign: "center", padding: "10px" }}>
          <Loader2
            size={16}
            color="#007cbf"
            style={{ animation: "spin 1s linear infinite" }}
          />
        </div>
      ) : (
        <>
          <div
            style={{
              fontSize: "14px",
              fontWeight: "600",
              color: "white",
              marginBottom: "4px",
            }}
          >
            {locationInfo?.city}
          </div>
          {locationInfo?.state && (
            <div
              style={{
                fontSize: "11px",
                color: "rgba(255, 255, 255, 0.6)",
                marginBottom: "8px",
              }}
            >
              {locationInfo.state}
            </div>
          )}
          <div
            style={{
              display: "flex",
              gap: "8px",
              fontSize: "10px",
              color: "rgba(255, 255, 255, 0.7)",
            }}
          >
            <span>📍 {coordinates.lat.toFixed(4)}°</span>
            <span>📍 {coordinates.lng.toFixed(4)}°</span>
          </div>
        </>
      )}
    </div>
  );
};
