import "./App.css";
import Map from "./components/Map";

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
            src="../public/skyhawklogo1.png"
            alt="Logo"
            style={{
              height: "48px",
              width: "auto",
              border: "2px solid #007cbf",
              borderRadius: "8px",
              padding: "4px",
              backgroundColor: "#1a1a1a",
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

        {/* Barra de Busca (lado direito) */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              backgroundColor: "#2a2a2a",
              border: "1px solid #444",
              borderRadius: "6px",
              padding: "0",
              minWidth: "300px",
            }}
          >
            <input
              type="text"
              placeholder="Buscar localização..."
              style={{
                backgroundColor: "transparent",
                border: "none",
                color: "white",
                padding: "8px 12px",
                fontSize: "14px",
                outline: "none",
                flex: 1,
              }}
            />
            <button
              style={{
                backgroundColor: "#007cbf",
                border: "none",
                color: "white",
                padding: "8px 12px",
                borderRadius: "0 5px 5px 0",
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
        <Map />
      </div>
    </div>
  );
}

export default App;
