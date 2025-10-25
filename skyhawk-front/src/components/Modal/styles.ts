export const modalStyles = {
  overlay: {
    position: "fixed" as const,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.85)",
    backdropFilter: "blur(15px)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 2000,
    animation: "fadeIn 0.4s ease-out",
  },
  container: {
    background:
      "linear-gradient(135deg, rgba(26, 26, 26, 0.95) 0%, rgba(42, 42, 42, 0.85) 50%, rgba(26, 26, 26, 0.95) 100%)",
    backdropFilter: "blur(25px)",
    border: "1px solid rgba(255, 255, 255, 0.15)",
    borderRadius: "24px",
    padding: "32px",
    maxWidth: "95vw",
    width: "95vw",
    maxHeight: "90vh",
    height: "90vh",
    overflow: "hidden",
    color: "white",
    fontFamily: "system-ui, Avenir, Helvetica, Arial, sans-serif",
    boxShadow: `
      0 32px 64px -12px rgba(0, 0, 0, 0.8),
      0 0 0 1px rgba(255, 255, 255, 0.08),
      inset 0 1px 0 rgba(255, 255, 255, 0.1)
    `,
    animation: "fadeIn 0.5s cubic-bezier(0.4, 0, 0.2, 1)",
    display: "flex",
    flexDirection: "column" as const,
  },
  section: {
    background:
      "linear-gradient(135deg, rgba(42, 42, 42, 0.7) 0%, rgba(26, 26, 26, 0.9) 100%)",
    backdropFilter: "blur(15px)",
    padding: "20px",
    borderRadius: "16px",
    border: "1px solid rgba(255, 255, 255, 0.12)",
    boxShadow: `
      0 8px 32px rgba(0, 0, 0, 0.4),
      inset 0 1px 0 rgba(255, 255, 255, 0.1)
    `,
    position: "relative" as const,
    overflow: "hidden",
  },
};
