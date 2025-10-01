import { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";

mapboxgl.accessToken =
  "pk.eyJ1IjoiYm9pdGF0YSIsImEiOiJjbTlrZGF3ejgwb2FxMnJvYWZ1Z3pudndpIn0.EiV7WmRDDZZBkY2A0PSJ1A";

const Map = () => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const [selectionMode, setSelectionMode] = useState(false);
  const [selectedArea, setSelectedArea] = useState<{
    northeast: { lng: number; lat: number };
    southwest: { lng: number; lat: number };
  } | null>(null);
  const [markers, setMarkers] = useState<mapboxgl.Marker[]>([]);

  useEffect(() => {
    if (!mapContainer.current) return;

    const map = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/dark-v11",
      center: [-46.6333, -23.5505],
      zoom: 7,
    });

    mapRef.current = map;

    // Variáveis para controlar o desenho do retângulo
    let isDrawing = false;
    let startPoint: { x: number; y: number } | null = null;
    let box: HTMLDivElement | null = null;

    // Função para criar o elemento visual do retângulo
    const createBox = () => {
      box = document.createElement("div");
      box.style.position = "absolute";
      box.style.border = "2px dashed #007cbf";
      box.style.backgroundColor = "rgba(0, 124, 191, 0.1)";
      box.style.pointerEvents = "none";
      box.style.zIndex = "1000";
      mapContainer.current?.appendChild(box);
    };

    // Função para atualizar o retângulo durante o arraste
    const updateBox = (currentPoint: { x: number; y: number }) => {
      if (!box || !startPoint) return;

      const minX = Math.min(startPoint.x, currentPoint.x);
      const maxX = Math.max(startPoint.x, currentPoint.x);
      const minY = Math.min(startPoint.y, currentPoint.y);
      const maxY = Math.max(startPoint.y, currentPoint.y);

      box.style.left = `${minX}px`;
      box.style.top = `${minY}px`;
      box.style.width = `${maxX - minX}px`;
      box.style.height = `${maxY - minY}px`;
    };

    // Função para finalizar a seleção
    const finishSelection = (endPoint: { x: number; y: number }) => {
      if (!startPoint) return;

      const minX = Math.min(startPoint.x, endPoint.x);
      const maxX = Math.max(startPoint.x, endPoint.x);
      const minY = Math.min(startPoint.y, endPoint.y);
      const maxY = Math.max(startPoint.y, endPoint.y);

      // Converter coordenadas de tela para coordenadas geográficas
      const southWest = map.unproject([minX, maxY]);
      const northEast = map.unproject([maxX, minY]);

      const area = {
        southwest: { lng: southWest.lng, lat: southWest.lat },
        northeast: { lng: northEast.lng, lat: northEast.lat },
      };

      setSelectedArea(area);
      console.log("Área selecionada:", area);
      console.log(`Southwest: ${area.southwest.lng}, ${area.southwest.lat}`);
      console.log(`Northeast: ${area.northeast.lng}, ${area.northeast.lat}`);

      // Adicionar retângulo permanente no mapa
      if (map.getSource("selection-area")) {
        map.removeLayer("selection-area-line");
        map.removeLayer("selection-area-fill");
        map.removeSource("selection-area");
      }

      map.addSource("selection-area", {
        type: "geojson",
        data: {
          type: "Feature",
          geometry: {
            type: "Polygon",
            coordinates: [
              [
                [southWest.lng, southWest.lat],
                [northEast.lng, southWest.lat],
                [northEast.lng, northEast.lat],
                [southWest.lng, northEast.lat],
                [southWest.lng, southWest.lat],
              ],
            ],
          },
          properties: {},
        },
      });

      map.addLayer({
        id: "selection-area-fill",
        type: "fill",
        source: "selection-area",
        paint: {
          "fill-color": "#007cbf",
          "fill-opacity": 0.1,
        },
      });

      map.addLayer({
        id: "selection-area-line",
        type: "line",
        source: "selection-area",
        paint: {
          "line-color": "#007cbf",
          "line-width": 2,
          "line-dasharray": [2, 2],
        },
      });
    };

    // Event listeners para desenhar o retângulo
    const onMouseDown = (e: mapboxgl.MapMouseEvent) => {
      if (!selectionMode) return;

      isDrawing = true;
      startPoint = { x: e.point.x, y: e.point.y };
      createBox();

      // Desabilitar navegação do mapa durante o desenho
      map.dragPan.disable();
      map.scrollZoom.disable();
      map.doubleClickZoom.disable();
    };

    const onMouseMove = (e: mapboxgl.MapMouseEvent) => {
      if (!isDrawing || !selectionMode) return;
      updateBox({ x: e.point.x, y: e.point.y });
    };

    const onMouseUp = (e: mapboxgl.MapMouseEvent) => {
      if (!isDrawing || !selectionMode) return;

      finishSelection({ x: e.point.x, y: e.point.y });

      // Limpar elementos temporários
      if (box) {
        mapContainer.current?.removeChild(box);
        box = null;
      }

      isDrawing = false;
      startPoint = null;
      // Não desativar o modo de seleção automaticamente
      // setSelectionMode(false);

      // Reabilitar navegação do mapa
      map.dragPan.enable();
      map.scrollZoom.enable();
      map.doubleClickZoom.enable();
    };

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

    map.on("mousedown", onMouseDown);
    map.on("mousemove", onMouseMove);
    map.on("mouseup", onMouseUp);

    return () => {
      map.off("mousedown", onMouseDown);
      map.off("mousemove", onMouseMove);
      map.off("mouseup", onMouseUp);
      map.remove();
    };
  }, [selectionMode]);

  // Função para limpar seleção
  const clearSelection = () => {
    if (mapRef.current) {
      if (mapRef.current.getSource("selection-area")) {
        mapRef.current.removeLayer("selection-area-line");
        mapRef.current.removeLayer("selection-area-fill");
        mapRef.current.removeSource("selection-area");
      }
    }
    setSelectedArea(null);
  };

  // Função para limpar todos os marcadores
  const clearAllMarkers = () => {
    markers.forEach((marker) => marker.remove());
    setMarkers([]);
    console.log("Todos os marcadores removidos");
  };

  return (
    <div style={{ width: "100%", height: "100%", position: "relative" }}>
      {/* Controles */}
      <div
        style={{
          position: "absolute",
          top: "10px",
          left: "15px",
          zIndex: 1000,
          backgroundColor: "#2a2a2a",
          padding: "5px",
          borderRadius: "5px",
          borderColor: "#007cbf",
          borderWidth: "1px",
          borderStyle: "solid",
          //boxShadow: "0 2px 10px rgba(0,0,0,0.3)",
        }}
      >
        <button
          onClick={() => {
            if (selectionMode) {
              // Se estiver em modo de seleção, cancelar e limpar tudo
              setSelectionMode(false);
              clearSelection();
            } else {
              // Se não estiver em modo de seleção, ativar
              setSelectionMode(true);
            }
          }}
          style={{
            padding: "8px 12px",
            marginRight: "5px",
            backgroundColor: selectionMode ? "#fff" : "#007cbf",
            color: selectionMode ? "#007cbf" : "#fff",
            border: "1px solid #007cbf",
            borderRadius: "3px",
            cursor: "pointer",
          }}
        >
          {selectionMode ? "Cancelar Seleção" : "Selecionar Área"}
        </button>

        {selectedArea && (
          <button
            onClick={clearSelection}
            style={{
              padding: "8px 12px",
              marginRight: "5px",
              backgroundColor: "#dc3545",
              color: "white",
              border: "none",
              borderRadius: "3px",
              cursor: "pointer",
            }}
          >
            Limpar Área
          </button>
        )}

        {markers.length > 0 && (
          <button
            onClick={clearAllMarkers}
            style={{
              padding: "8px 12px",
              backgroundColor: "#6c757d",
              color: "white",
              border: "none",
              borderRadius: "3px",
              cursor: "pointer",
            }}
          >
            Limpar Marcadores ({markers.length})
          </button>
        )}
      </div>

      {/* Informações da área selecionada */}
      {selectedArea && (
        <div
          style={{
            position: "absolute",
            bottom: "10px",
            left: "10px",
            zIndex: 1000,
            backgroundColor: "white",
            padding: "10px",
            borderRadius: "5px",
            boxShadow: "0 2px 10px rgba(0,0,0,0.3)",
            fontFamily: "monospace",
            fontSize: "12px",
            maxWidth: "300px",
            color: "#333333",
          }}
        >
          <div>
            <strong>Área Selecionada:</strong>
          </div>
          <div>
            SW: {selectedArea.southwest.lng.toFixed(6)},{" "}
            {selectedArea.southwest.lat.toFixed(6)}
          </div>
          <div>
            NE: {selectedArea.northeast.lng.toFixed(6)},{" "}
            {selectedArea.northeast.lat.toFixed(6)}
          </div>
        </div>
      )}

      {/* Informações dos marcadores */}
      {markers.length > 0 && (
        <div
          style={{
            position: "absolute",
            bottom: selectedArea ? "120px" : "10px", // Ajusta posição se há área selecionada
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
