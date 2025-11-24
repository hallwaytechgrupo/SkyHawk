import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { visualizer } from "rollup-plugin-visualizer";
import compression from "vite-plugin-compression";

export default defineConfig({
  plugins: [
    react(),
    // Gera arquivos .gz para compressão
    compression({
      verbose: true,
      algorithm: "gzip",
      ext: ".gz",
    }),
    // Gera arquivos .br para compressão (Brotli)
    compression({
      verbose: true,
      algorithm: "brotliCompress",
      ext: ".br",
    }),
    // Gera um relatório visual do bundle em dist/stats.html
    visualizer({
      open: true, // Abre o relatório no navegador após o build
      gzipSize: true,
      brotliSize: true,
    }),
  ],
  build: {
    rollupOptions: {
      output: {
        // Separa bibliotecas grandes em chunks dedicados
        manualChunks: (id) => {
          if (id.includes("node_modules")) {
            if (id.includes("leaflet")) {
              return "vendor_leaflet";
            }
            if (id.includes("recharts")) {
              return "vendor_recharts";
            }
            return "vendor_core"; // Outras dependências
          }
        },
      },
    },
  },
});
