import { useRef, useEffect, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import Modal from "./Modal"; // ✅ Import correto (pasta Modal/)
import { skyHawkService } from "../services/skyHawkService";
import type { TimeSeriesData } from "../services/skyHawkService";

mapboxgl.accessToken =
  "pk.eyJ1IjoiYm9pdGF0YSIsImEiOiJjbTlrZGF3ejgwb2FxMnJvYWZ1Z3pudndpIn0.EiV7WmRDDZZBkY2A0PSJ1A";

const MapComponent = () => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const marker = useRef<mapboxgl.Marker | null>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCoordinates, setSelectedCoordinates] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const [timeSeriesData, setTimeSeriesData] = useState<TimeSeriesData | null>(
    null
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!mapContainer.current || map.current) return;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/satellite-streets-v12",
      center: [-46.6333, -23.5505],
      zoom: 10,
    });

    map.current.on("click", (e) => {
      const { lng, lat } = e.lngLat;
      setSelectedCoordinates({ lat, lng });

      if (marker.current) {
        marker.current.remove();
      }

      marker.current = new mapboxgl.Marker({ color: "#007cbf" })
        .setLngLat([lng, lat])
        .addTo(map.current!);

      setIsModalOpen(true);
    });

    return () => {
      if (marker.current) marker.current.remove();
      if (map.current) map.current.remove();
    };
  }, []);

  const handleFiltersChange = async (filters: {
    satellite: string;
    variable: string;
    startDate: string;
    endDate: string;
  }) => {
    if (!selectedCoordinates) return;

    setLoading(true);
    setError(null);

    try {
      const data = await skyHawkService.getTimeSeries(
        selectedCoordinates.lat,
        selectedCoordinates.lng,
        filters
      );
      setTimeSeriesData(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao buscar dados");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div ref={mapContainer} style={{ width: "100%", height: "100%" }} />

      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setTimeSeriesData(null);
          setError(null);
        }}
        data={timeSeriesData}
        coordinates={selectedCoordinates}
        loading={loading}
        error={error}
        onFiltersChange={handleFiltersChange}
      />
    </>
  );
};

export default MapComponent;
