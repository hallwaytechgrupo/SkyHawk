import { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";

mapboxgl.accessToken =
  "pk.eyJ1IjoiYm9pdGF0YSIsImEiOiJjbTlrZGF3ejgwb2FxMnJvYWZ1Z3pudndpIn0.EiV7WmRDDZZBkY2A0PSJ1A";

const Map = () => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const [markers, setMarkers] = useState<mapboxgl.Marker[]>([]);
  const [selectionMode] = useState(false);

  useEffect(() => {
    if (!mapContainer.current) return;

    const map = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/dark-v11",
      center: [-46.6333, -23.5505],
      zoom: 7,
    });

    mapRef.current = map;

    // Click simples para adicionar marcadores (quando não estiver em modo de seleção)
    map.on("click", (e) => {
      if (!selectionMode) {
        const { lng, lat } = e.lngLat;
        console.log(`Ponto selecionado: ${lng}, ${lat}`);

        // Criar marcador padrão do Mapbox
        const marker = new mapboxgl.Marker().setLngLat([lng, lat]).addTo(map);

        // Adicionar evento de clique no marcador para removê-lo
        const markerElement = marker.getElement();
        markerElement.style.cursor = "pointer";
        markerElement.title = "Clique para remover este marcador";

        markerElement.addEventListener("click", (event) => {
          event.stopPropagation(); // Evita propagar o clique para o mapa
          marker.remove();
          setMarkers((prevMarkers) => prevMarkers.filter((m) => m !== marker));
          console.log("Marcador removido");
        });

        // Armazenar o marcador no estado
        setMarkers((prevMarkers) => [...prevMarkers, marker]);
      }
    });
  }, [selectionMode]);

  // Função para limpar todos os marcadores
  const clearAllMarkers = () => {
    markers.forEach((marker) => marker.remove());
    setMarkers([]);
    console.log("Todos os marcadores removidos");
  };

  return (
    <div style={{ width: "100%", height: "100%", position: "relative" }}>
      {/* Controles */}
      {markers.length > 0 && (
        <div
          style={{
            position: "absolute",
            top: "10px",
            left: "10px",
            zIndex: 1000,
          }}
        >
          <button
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

      <div ref={mapContainer} style={{ width: "100%", height: "100%" }} />
    </div>
  );
};

export default Map;
