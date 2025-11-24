import React, { Suspense, lazy } from "react";
import "./App.css";

// Carrega o componente Map sob demanda (lazy loading)
const Map = lazy(() => import("./components/Map"));

// Componente de fallback para exibir durante o carregamento
const LoadingFallback = () => (
  <div
    style={{
      height: "100%",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: "#1e1e1e",
    }}
  >
    <div style={{ textAlign: "center", color: "white" }}>
      <img
        src="/skyhawklogo.png"
        alt="Logo"
        style={{ height: "80px", marginBottom: "20px" }}
      />
      <p>Carregando sistema de monitoramento...</p>
    </div>
  </div>
);

function App() {
  return (
    <div
      style={{
        width: "100%",
        height: "100vh",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Barra Superior */}
      <header
        style={{
          backgroundColor: "#1a1a1a",
          color: "white",
          padding: "3px 24px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          boxShadow: "0 2px 10px rgba(0,0,0,0.3)",
          zIndex: 1000,
          minHeight: "30px",
        }}
      >
        {/* Logo/Título */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          <img
            src="/skyhawklogo.webp" // ✅ MUDANÇA: Usar imagem otimizada
            alt="Logo"
            style={{
              height: "48px",
              width: "auto",
              border: "2px solid #007cbf",
              borderRadius: "8px",
              padding: "4px",
              backgroundColor: "transparent",
            }}
          />
          <div
            style={{
              color: "white",
              borderRadius: "6px",
              padding: "4px 8px",
              fontWeight: "bold",
              fontSize: "26px",
            }}
          >
            SKYHAWK
          </div>
          <span
            style={{
              fontSize: "14px",
              color: "#cccccc",
            }}
          >
            Sistema de Monitoramento Geográfico
          </span>
        </div>

        {/* Campos de Coordenadas (lado direito) */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          {/* Campo Latitude */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              backgroundColor: "#2a2a2a",
              border: "1px solid #444",
              borderRadius: "6px",
              padding: "0",
              minWidth: "140px",
            }}
          >
            <span
              style={{
                color: "#cccccc",
                fontSize: "12px",
                padding: "8px 8px 8px 12px",
                fontWeight: "bold",
              }}
            >
              LAT:
            </span>
            <input
              type="number"
              step="any"
              placeholder="-23.5505"
              style={{
                backgroundColor: "transparent",
                border: "none",
                color: "white",
                padding: "8px 8px 8px 4px",
                fontSize: "14px",
                outline: "none",
                flex: 1,
                width: "80px",
              }}
            />
          </div>

          {/* Campo Longitude */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              backgroundColor: "#2a2a2a",
              border: "1px solid #444",
              borderRadius: "6px",
              padding: "0",
              minWidth: "140px",
            }}
          >
            <span
              style={{
                color: "#cccccc",
                fontSize: "12px",
                padding: "8px 8px 8px 12px",
                fontWeight: "bold",
              }}
            >
              LNG:
            </span>
            <input
              type="number"
              step="any"
              placeholder="-46.6333"
              style={{
                backgroundColor: "transparent",
                border: "none",
                color: "white",
                padding: "8px 8px 8px 4px",
                fontSize: "14px",
                outline: "none",
                flex: 1,
                width: "80px",
              }}
            />
          </div>

          {/* Botão Buscar */}
          <button
            style={{
              backgroundColor: "#007cbf",
              border: "none",
              color: "white",
              padding: "8px 12px",
              borderRadius: "6px",
              cursor: "pointer",
              fontSize: "14px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.35-4.35" />
            </svg>
          </button>
        </div>
      </header>

      {/* Área do Mapa */}
      <div
        style={{
          flex: 1,
          width: "100%",
          height: "calc(100vh - 60px)",
          overflow: "hidden",
        }}
      >
        {/* Suspense mostra o fallback enquanto o Map é carregado */}
        <Suspense fallback={<LoadingFallback />}>
          <Map />
        </Suspense>
      </div>
    </div>
  );
}

export default App;
