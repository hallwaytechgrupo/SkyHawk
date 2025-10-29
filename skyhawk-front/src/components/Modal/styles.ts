export const modalStyles = {
  overlay: {
    position: "fixed" as const,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.85)",
    backdropFilter: "blur(8px)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 2000,
    padding: "20px",
  },

  container: {
    width: "95vw",
    height: "90vh",
    maxWidth: "1600px",
    backgroundColor: "rgba(18, 18, 18, 0.98)",
    borderRadius: "16px",
    padding: "24px",
    boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.8)",
    display: "flex",
    flexDirection: "column" as const,
    border: "1px solid rgba(0, 124, 191, 0.2)",
    position: "relative" as const,
    // ✅ REMOVER OU AJUSTAR OVERFLOW
    overflow: "visible", // ou "hidden" apenas no container principal
  },

  section: {
    padding: "16px 20px",
    borderRadius: "12px",
    marginBottom: "12px",
    backgroundColor: "rgba(26, 26, 26, 0.95)",
    border: "1px solid rgba(255, 255, 255, 0.08)",
    position: "relative" as const,
    overflow: "visible",
    zIndex: 1,
  },
};
