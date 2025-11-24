import React, { useState } from "react";
import { Info } from "lucide-react";
import { createPortal } from "react-dom";

// ✅ Tooltip Component com Portal e Detecção de Limites
const Tooltip: React.FC<{ text: string; children: React.ReactNode }> = ({
  text,
  children,
}) => {
  const [show, setShow] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const [alignment, setAlignment] = useState<"top" | "bottom" | "right">("top");
  const triggerRef = React.useRef<HTMLDivElement>(null);
  const tooltipRef = React.useRef<HTMLDivElement>(null);

  const handleMouseEnter = () => {
    if (triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      const viewportWidth = window.innerWidth;

      let newTop = rect.top - 8;
      let newLeft = rect.left + rect.width / 2;
      let newAlignment: "top" | "bottom" | "right" = "top";

      // ✅ Verificar se tooltip cabe acima
      if (newTop - 100 < 0) {
        // ✅ Não cabe acima, mostrar abaixo
        newTop = rect.bottom + 8;
        newAlignment = "bottom";
      }

      // ✅ Verificar se tooltip ultrapassa a direita
      if (newLeft + 160 > viewportWidth) {
        newLeft = rect.right + 8;
        newTop = rect.top + rect.height / 2;
        newAlignment = "right";
      }

      // ✅ Verificar se tooltip ultrapassa a esquerda
      if (newLeft - 160 < 0) {
        newLeft = Math.max(160, newLeft);
      }

      setPosition({ top: newTop, left: newLeft });
      setAlignment(newAlignment);
    }
    setShow(true);
  };

  return (
    <>
      <div
        ref={triggerRef}
        style={{
          position: "relative",
          display: "inline-flex",
        }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={() => setShow(false)}
      >
        {children}
      </div>

      {/* ✅ PORTAL - Renderiza fora do container */}
      {show &&
        createPortal(
          <div
            ref={tooltipRef}
            style={{
              position: "fixed",
              top: `${position.top}px`,
              left: `${position.left}px`,
              transform:
                alignment === "top"
                  ? "translate(-50%, -100%)"
                  : alignment === "bottom"
                  ? "translate(-50%, 0%)"
                  : "translate(0%, -50%)", // ✅ Ajuste para direita
              backgroundColor: "rgba(26, 26, 26, 0.98)",
              color: "white",
              padding: "8px 12px",
              borderRadius: "6px",
              fontSize: "11px",
              zIndex: 999999,
              border: "1px solid rgba(255, 255, 255, 0.1)",
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.6)",
              pointerEvents: "none",
              minWidth: "200px",
              maxWidth: "320px",
              whiteSpace: "normal",
              lineHeight: "1.4",
            }}
          >
            {text}

            {/* ✅ Seta dinâmica baseada no alinhamento */}
            {alignment === "top" && (
              <div
                style={{
                  position: "absolute",
                  bottom: "-6px",
                  left: "50%",
                  transform: "translateX(-50%)",
                  width: 0,
                  height: 0,
                  borderLeft: "6px solid transparent",
                  borderRight: "6px solid transparent",
                  borderTop: "6px solid rgba(26, 26, 26, 0.98)",
                }}
              />
            )}

            {alignment === "bottom" && (
              <div
                style={{
                  position: "absolute",
                  top: "-6px",
                  left: "50%",
                  transform: "translateX(-50%)",
                  width: 0,
                  height: 0,
                  borderLeft: "6px solid transparent",
                  borderRight: "6px solid transparent",
                  borderBottom: "6px solid rgba(26, 26, 26, 0.98)",
                }}
              />
            )}

            {alignment === "right" && (
              <div
                style={{
                  position: "absolute",
                  left: "-6px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  width: 0,
                  height: 0,
                  borderTop: "6px solid transparent",
                  borderBottom: "6px solid transparent",
                  borderRight: "6px solid rgba(26, 26, 26, 0.98)",
                }}
              />
            )}
          </div>,
          document.body
        )}
    </>
  );
};

// Interpretation Panel Component
export const InterpretationPanel: React.FC = () => {
  return (
    <div
      style={{
        backgroundColor: "rgba(26, 26, 26, 0.95)",
        border: "1px solid rgba(0, 124, 191, 0.3)",
        borderRadius: "8px",
        overflow: "hidden",
        maxHeight: "500px",
        display: "flex",
        flexDirection: "column",
        position: "relative",
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: "10px 12px",
          background:
            "linear-gradient(135deg, rgba(0, 124, 191, 0.1), rgba(0, 124, 191, 0.05))",
          borderBottom: "1px solid rgba(0, 124, 191, 0.2)",
          display: "flex",
          alignItems: "center",
          gap: "6px",
          flexShrink: 0,
        }}
      >
        <Info size={14} color="#007cbf" />
        <span
          style={{
            fontSize: "12px",
            fontWeight: "600",
            color: "white",
          }}
        >
          Interpretação dos Índices
        </span>
      </div>

      {/* Content COM SCROLL */}
      <div
        className="custom-scrollbar"
        style={{
          padding: "12px",
          flex: 1,
          overflowY: "auto",
          overflowX: "hidden",
        }}
      >
        {/* NDVI Section */}
        <div style={{ marginBottom: "14px" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              marginBottom: "8px",
            }}
          >
            <div
              style={{
                width: "18px",
                height: "18px",
                background: "linear-gradient(135deg, #4caf50 0%, #66bb6a 100%)",
                borderRadius: "4px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "9px",
                fontWeight: "700",
                color: "white",
              }}
            >
              N
            </div>
            <h4
              style={{
                margin: 0,
                fontSize: "12px",
                color: "#4caf50",
                fontWeight: "600",
              }}
            >
              NDVI
            </h4>
            <Tooltip text="Índice de Vegetação por Diferença Normalizada - Mede densidade e saúde da vegetação">
              <Info
                size={11}
                color="rgba(255, 255, 255, 0.5)"
                style={{ cursor: "help" }}
              />
            </Tooltip>
          </div>

          {/* NDVI Scale */}
          <div style={{ marginBottom: "8px" }}>
            <div
              style={{
                display: "flex",
                height: "5px",
                borderRadius: "3px",
                overflow: "hidden",
                marginBottom: "5px",
              }}
            >
              <div style={{ flex: 1, background: "#2196f3" }} title="Água" />
              <div style={{ flex: 1, background: "#f44336" }} title="Solo" />
              <div style={{ flex: 1, background: "#ff9800" }} title="Esparsa" />
              <div
                style={{ flex: 1, background: "#ffeb3b" }}
                title="Moderada"
              />
              <div style={{ flex: 1, background: "#8bc34a" }} title="Densa" />
              <div
                style={{ flex: 1, background: "#4caf50" }}
                title="Muito Densa"
              />
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                fontSize: "10px",
                color: "rgba(255, 255, 255, 0.5)",
              }}
            >
              <span>-1</span>
              <span>0</span>
              <span>0.2</span>
              <span>0.4</span>
              <span>0.6</span>
              <span>0.8</span>
              <span>1</span>
            </div>
          </div>

          {/* NDVI Levels */}
          <div style={{ display: "flex", flexDirection: "column", gap: "3px" }}>
            {[
              {
                range: "-1 a 0",
                color: "#2196f3",
                desc: "Água, nuvens",
                tooltip: "Corpos d'água, neve, nuvens densas",
              },
              {
                range: "0 a 0.2",
                color: "#f44336",
                desc: "Solo exposto",
                tooltip: "Solo nu, rochas, áreas urbanas, estradas",
              },
              {
                range: "0.2 a 0.4",
                color: "#ff9800",
                desc: "Veg. esparsa",
                tooltip: "Vegetação esparsa, gramíneas secas, arbustos",
              },
              {
                range: "0.4 a 0.6",
                color: "#ffeb3b",
                desc: "Veg. moderada",
                tooltip: "Vegetação moderada, agricultura, pastagens",
              },
              {
                range: "0.6 a 0.8",
                color: "#8bc34a",
                desc: "Veg. densa",
                tooltip: "Vegetação densa, culturas saudáveis, campos verdes",
              },
              {
                range: "0.8 a 1",
                color: "#4caf50",
                desc: "Muito densa",
                tooltip:
                  "Vegetação muito densa, florestas tropicais, matas fechadas",
              },
            ].map((item, idx) => (
              <Tooltip key={idx} text={item.tooltip}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "5px",
                    fontSize: "10px",
                    padding: "3px 5px",
                    borderRadius: "3px",
                    cursor: "help",
                    transition: "background 0.2s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background =
                      "rgba(255, 255, 255, 0.05)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "transparent";
                  }}
                >
                  <div
                    style={{
                      width: "5px",
                      height: "5px",
                      borderRadius: "50%",
                      backgroundColor: item.color,
                      flexShrink: 0,
                    }}
                  />
                  <span
                    style={{
                      color: "rgba(255, 255, 255, 0.9)",
                      fontWeight: "600",
                      minWidth: "45px",
                    }}
                  >
                    {item.range}
                  </span>
                  <span style={{ color: "rgba(255, 255, 255, 0.6)" }}>
                    {item.desc}
                  </span>
                </div>
              </Tooltip>
            ))}
          </div>
        </div>

        {/* Divider */}
        <div
          style={{
            height: "1px",
            background: "rgba(0, 124, 191, 0.2)",
            margin: "12px 0",
          }}
        />

        {/* EVI Section */}
        <div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              marginBottom: "8px",
            }}
          >
            <div
              style={{
                width: "18px",
                height: "18px",
                background: "linear-gradient(135deg, #00bcd4 0%, #26c6da 100%)",
                borderRadius: "4px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "9px",
                fontWeight: "700",
                color: "white",
              }}
            >
              E
            </div>
            <h4
              style={{
                margin: 0,
                fontSize: "12px",
                color: "#00bcd4",
                fontWeight: "600",
              }}
            >
              EVI
            </h4>
            <Tooltip text="Índice de Vegetação Melhorado - Corrige influência atmosférica e do solo, mais sensível em áreas densas">
              <Info
                size={11}
                color="rgba(255, 255, 255, 0.5)"
                style={{ cursor: "help" }}
              />
            </Tooltip>
          </div>

          {/* EVI Scale */}
          <div style={{ marginBottom: "8px" }}>
            <div
              style={{
                display: "flex",
                height: "5px",
                borderRadius: "3px",
                overflow: "hidden",
                marginBottom: "5px",
              }}
            >
              <div
                style={{ flex: 1, background: "#37474f" }}
                title="Sem Veg."
              />
              <div
                style={{ flex: 1, background: "#795548" }}
                title="Muito Esparsa"
              />
              <div style={{ flex: 1, background: "#ffa726" }} title="Esparsa" />
              <div
                style={{ flex: 1, background: "#26a69a" }}
                title="Moderada"
              />
              <div style={{ flex: 1, background: "#00bcd4" }} title="Densa" />
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                fontSize: "8px",
                color: "rgba(255, 255, 255, 0.5)",
              }}
            >
              <span>-1</span>
              <span>0</span>
              <span>0.2</span>
              <span>0.4</span>
              <span>0.6</span>
              <span>1</span>
            </div>
          </div>

          {/* EVI Levels */}
          <div style={{ display: "flex", flexDirection: "column", gap: "3px" }}>
            {[
              {
                range: "< 0",
                color: "#37474f",
                desc: "Sem vegetação",
                tooltip: "Água, neve, áreas sem cobertura vegetal",
              },
              {
                range: "0 a 0.2",
                color: "#795548",
                desc: "Muito esparsa",
                tooltip: "Solo exposto, vegetação muito rala ou seca",
              },
              {
                range: "0.2 a 0.4",
                color: "#ffa726",
                desc: "Esparsa",
                tooltip: "Vegetação esparsa, savanas, cerrados abertos",
              },
              {
                range: "0.4 a 0.6",
                color: "#26a69a",
                desc: "Moderada",
                tooltip: "Vegetação moderada a densa, agricultura produtiva",
              },
              {
                range: "> 0.6",
                color: "#00bcd4",
                desc: "Densa",
                tooltip:
                  "Vegetação muito densa, florestas tropicais, mata atlântica",
              },
            ].map((item, idx) => (
              <Tooltip key={idx} text={item.tooltip}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "5px",
                    fontSize: "10px",
                    padding: "3px 5px",
                    borderRadius: "3px",
                    cursor: "help",
                    transition: "background 0.2s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background =
                      "rgba(255, 255, 255, 0.05)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "transparent";
                  }}
                >
                  <div
                    style={{
                      width: "5px",
                      height: "5px",
                      borderRadius: "50%",
                      backgroundColor: item.color,
                      flexShrink: 0,
                    }}
                  />
                  <span
                    style={{
                      color: "rgba(255, 255, 255, 0.9)",
                      fontWeight: "600",
                      minWidth: "45px",
                    }}
                  >
                    {item.range}
                  </span>
                  <span style={{ color: "rgba(255, 255, 255, 0.6)" }}>
                    {item.desc}
                  </span>
                </div>
              </Tooltip>
            ))}
          </div>
        </div>

        {/* Tip */}
        <div
          style={{
            marginTop: "10px",
            padding: "6px 8px",
            backgroundColor: "rgba(255, 193, 7, 0.1)",
            border: "1px solid rgba(255, 193, 7, 0.3)",
            borderRadius: "5px",
            display: "flex",
            gap: "5px",
            alignItems: "flex-start",
          }}
        >
          <Info
            size={11}
            color="#ffc107"
            style={{ marginTop: "1px", flexShrink: 0 }}
          />
          <span
            style={{
              fontSize: "10px",
              color: "rgba(255, 193, 7, 0.95)",
              lineHeight: "1.3",
            }}
          >
            <strong>Dica:</strong> Passe o mouse sobre cada nível para mais
            detalhes
          </span>
        </div>
      </div>
    </div>
  );
};
