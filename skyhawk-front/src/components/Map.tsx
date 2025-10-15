import { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import Modal from "./Modal";
import {
  skyHawkService,
  type TimeSeriesData,
} from "../services/skyHawkService";

mapboxgl.accessToken =
  "pk.eyJ1IjoiYm9pdGF0YSIsImEiOiJjbTlrZGF3ejgwb2FxMnJvYWZ1Z3pudndpIn0.EiV7WmRDDZZBkY2A0PSJ1A";

const MapComponent = () => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const [markers, setMarkers] = useState<mapboxgl.Marker[]>([]);
  const [selectionMode] = useState(false);

  // Estados do Modal (consolidados)
  const [showModal, setShowModal] = useState(false);
  const [modalData, setModalData] = useState<TimeSeriesData | null>(null);
  const [modalCoordinates, setModalCoordinates] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const [modalLoading, setModalLoading] = useState(false);
  const [modalError, setModalError] = useState<string | null>(null);

  // Função para buscar dados com filtros (corrigida)
  const fetchSatelliteData = async (
    coordinates: { lat: number; lng: number },
    filters?: {
      satellite: string;
      variable: string;
      startDate: string;
      endDate: string;
    }
  ) => {
    setModalLoading(true);
    setModalError(null);
    setModalData(null);
    setModalCoordinates(coordinates);
    setShowModal(true);

    try {
      // Filtros padrão se não fornecidos
      const defaultFilters = {
        satellite: "landsat8",
        variable: "ndvi",
        startDate: "2023-01-01",
        endDate: "2023-12-31",
      };

      const activeFilters = filters || defaultFilters;

      console.log("=== BUSCANDO DADOS SATELITAIS ===");
      console.log("Coordenadas:", coordinates);
      console.log("Filtros:", activeFilters);
      console.log("================================");

      // Usar o serviço correto
      const data = await skyHawkService.getTimeSeries(
        coordinates.lat,
        coordinates.lng,
        activeFilters
      );

      console.log("=== DADOS RECEBIDOS ===");
      console.log("Sucesso:", data.success);
      console.log("Metadados:", data.data?.metadata);
      console.log("Número de pontos:", data.data?.timeline?.length);
      console.log("=====================");

      setModalData(data);
    } catch (error) {
      console.error("Erro ao buscar dados satelitais:", error);
      setModalError(
        error instanceof Error
          ? error.message
          : "Erro desconhecido ao buscar dados satelitais"
      );
    } finally {
      setModalLoading(false);
    }
  };

  // Handler para mudança de filtros
  const handleFiltersChange = (filters: {
    satellite: string;
    variable: string;
    startDate: string;
    endDate: string;
  }) => {
    console.log("Filtros alterados:", filters);
    if (modalCoordinates) {
      fetchSatelliteData(modalCoordinates, filters);
    }
  };

  useEffect(() => {
    if (!mapContainer.current) return;

    const map = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/dark-v11",
      center: [-46.6333, -23.5505],
      zoom: 7,
    });

    mapRef.current = map;

    // Click simples para adicionar marcadores
    map.on("click", (e) => {
      if (!selectionMode) {
        const { lng, lat } = e.lngLat;
        console.log(`Ponto clicado: ${lat}, ${lng}`);

        // Buscar dados satelitais
        fetchSatelliteData({ lat, lng });

        // Criar marcador padrão do Mapbox
        const marker = new mapboxgl.Marker().setLngLat([lng, lat]).addTo(map);

        // Adicionar evento de clique no marcador para removê-lo
        const markerElement = marker.getElement();
        markerElement.style.cursor = "pointer";
        markerElement.title = "Clique para remover este marcador";

        markerElement.addEventListener("click", (event) => {
          event.stopPropagation();
          marker.remove();
          setMarkers((prevMarkers) => prevMarkers.filter((m) => m !== marker));
          console.log("Marcador removido");
        });

        // Armazenar o marcador no estado
        setMarkers((prevMarkers) => [...prevMarkers, marker]);
      }
    });

    return () => {
      // Cleanup quando o componente desmontar
      map.remove();
    };
  }, [selectionMode]);

  // Função para limpar todos os marcadores
  const clearAllMarkers = () => {
    for (const marker of markers) {
      marker.remove();
    }
    setMarkers([]);
    console.log("Todos os marcadores removidos");
  };

  return (
    <>
      <div ref={mapContainer} style={{ width: "100%", height: "100%" }} />

      {/* Controles */}
      {markers.length > 0 && (
        <div
          style={{
            position: "absolute",
            top: "80px",
            left: "10px",
            zIndex: 1000,
          }}
        >
          <button
            type="button"
            onClick={clearAllMarkers}
            style={{
              padding: "8px 12px",
              backgroundColor: "#dc3545",
              color: "white",
              border: "none",
              borderRadius: "3px",
              cursor: "pointer",
              boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
            }}
          >
            Limpar Marcadores ({markers.length})
          </button>
        </div>
      )}

      {/* Informações dos marcadores */}
      {markers.length > 0 && (
        <div
          style={{
            position: "absolute",
            bottom: "10px",
            right: "10px",
            zIndex: 1000,
            backgroundColor: "white",
            padding: "10px",
            borderRadius: "5px",
            boxShadow: "0 2px 10px rgba(0,0,0,0.3)",
            fontFamily: "monospace",
            fontSize: "12px",
            maxWidth: "250px",
            color: "#333333",
          }}
        >
          <div>
            <strong>Marcadores ({markers.length}):</strong>
          </div>
          <div style={{ fontSize: "10px", color: "#666", marginTop: "5px" }}>
            Clique em um marcador para removê-lo
          </div>
        </div>
      )}

      {/* Modal para exibir dados da série temporal */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        data={modalData}
        coordinates={modalCoordinates}
        loading={modalLoading}
        error={modalError}
        onFiltersChange={handleFiltersChange}
      />
    </>
  );
};

export default MapComponent;
