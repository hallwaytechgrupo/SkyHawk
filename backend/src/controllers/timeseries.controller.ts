/**
 * Controller para gerenciar séries temporais
 */

import { Request, Response } from "express";
import { config } from "../config";
import * as wtssService from "../services/wtss.service";
import * as stacService from "../services/stac.service";

/**
 * POST /api/time-series
 * Retorna série temporal de NDVI para um ponto
 */
export async function getTimeSeries(
  req: Request,
  res: Response
): Promise<void> {
  // ✅ CORRIGIR: usar "satellite" em vez de "collection"
  const { lat, lng, satellite, variable, startDate, endDate } = req.body;

  console.log("🔵 ========== CONTROLLER RECEBEU ==========");
  console.log("📦 Request body completo:", req.body);
  console.log("📍 Coordenadas:", { lat, lng });
  console.log("🛰️ Satélite:", satellite);
  console.log("📊 Variável:", variable);
  console.log("📅 Período:", startDate, "até", endDate);
  console.log("=========================================");

  if (!lat || !lng) {
    res.status(400).json({ error: "Latitude e longitude são obrigatórios" });
    return;
  }

  // ✅ VALIDAR SE O SATÉLITE FOI ENVIADO
  if (!satellite) {
    console.error("❌ Satélite não foi enviado!");
    res.status(400).json({
      error: "Satélite é obrigatório",
      received: req.body,
    });
    return;
  }

  try {
    // ✅ USAR O SATÉLITE CORRETO
    const coverage = satellite; // Nome correto WTSS
    const attributes = [variable || config.defaults.variable];

    console.log("🚀 Chamando WTSS Service com:", {
      coverage,
      attributes,
      lat,
      lng,
      startDate: startDate || config.defaults.startDate,
      endDate: endDate || config.defaults.endDate,
    });

    const series = await wtssService.getTimeSeries(
      lat,
      lng,
      coverage, // ← AGORA USA O SATÉLITE CORRETO
      attributes,
      startDate || config.defaults.startDate,
      endDate || config.defaults.endDate
    );

    console.log("✅ Dados obtidos do WTSS:", {
      collection: series.metadata.collection,
      variable: series.metadata.variable,
      pontos: series.timeline.length,
    });

    res.json({
      success: true,
      data: series,
      source: "INPE WTSS v4",
    });
  } catch (error: any) {
    console.error("❌ Erro em getTimeSeries:", error.message);
    res.status(500).json({
      error: "Erro ao buscar série temporal",
      details: error.message,
    });
  }
}

/**
 * POST /api/compare
 * Compara séries temporais de múltiplos satélites
 */
export async function compareTimeSeries(
  req: Request,
  res: Response
): Promise<void> {
  const { lat, lng, collections, variable, startDate, endDate } = req.body;

  if (!lat || !lng) {
    res.status(400).json({ error: "Latitude e longitude são obrigatórios" });
    return;
  }

  if (!collections || collections.length < 2) {
    res
      .status(400)
      .json({ error: "Mínimo de 2 coleções necessário para comparação" });
    return;
  }

  try {
    const coverages = collections;
    const attributes = [variable || config.defaults.variable];

    const series = await wtssService.getMultipleTimeSeries(
      lat,
      lng,
      coverages,
      attributes,
      startDate || config.defaults.startDate,
      endDate || config.defaults.endDate
    );

    const alignedSeries = series.map((s) => ({
      satellite: s.metadata.collection,
      timeline: s.timeline,
      values: s.values,
      variable: s.metadata.variable,
    }));

    res.json({
      success: true,
      comparison: alignedSeries,
      source: "INPE WTSS v4",
    });
  } catch (error) {
    console.error("Erro em compareTimeSeries:", error);
    res.status(500).json({ error: "Erro ao comparar séries temporais" });
  }
}

/**
 * GET /api/export
 * Exporta dados em JSON ou CSV
 */
export async function exportData(req: Request, res: Response): Promise<void> {
  const {
    type = "json",
    collections,
    variable,
    startDate,
    endDate,
    lat,
    lng,
  } = req.query;

  if (!collections || !lat || !lng) {
    res
      .status(400)
      .json({ error: "Coleções, latitude e longitude são obrigatórios" });
    return;
  }

  try {
    const numLat = parseFloat(lat as string);
    const numLng = parseFloat(lng as string);
    const parsedCollections = (collections as string).split(",");

    const [items, series] = await Promise.all([
      stacService.searchItemsByPoint(
        numLat,
        numLng,
        parsedCollections,
        startDate as string,
        endDate as string
      ),
      wtssService.getMultipleTimeSeries(
        numLat,
        numLng,
        parsedCollections,
        [(variable as string) || config.defaults.variable],
        (startDate as string) || config.defaults.startDate,
        (endDate as string) || config.defaults.endDate
      ),
    ]);

    const exportData = {
      point: { lat: numLat, lng: numLng },
      filters: {
        collections: parsedCollections,
        variable: variable as string,
        period: `${startDate}/${endDate}`,
      },
      metadados: items.features,
      series,
      source: "INPE STAC/WTSS - Export",
    };

    if (type === "json") {
      res.json(exportData);
    } else {
      let csv = "Satellite,Date,Value\n";
      series.forEach((s: any) =>
        s.timeline.forEach(
          (date: string, i: number) =>
            (csv += `${s.metadata.collection},${date},${s.values[i]}\n`)
        )
      );
      res.header("Content-Type", "text/csv");
      res.attachment("export.csv");
      res.send(csv);
    }
  } catch (error) {
    console.error("Erro em exportData:", error);
    res.status(500).json({ error: "Erro ao exportar dados" });
  }
}

/**
 * GET /api/satellites
 * Lista satélites/coverages disponíveis
 */
export async function listSatellites(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const coverages = await wtssService.listCoverages();

    const satellites = coverages.map((cov: string) => {
      let name = cov;
      let description = "";

      if (cov === "mod13q1-6.1") {
        name = "MODIS Terra";
        description = "Resolução 250m, revisita 16 dias";
      } else if (cov === "myd13q1-6.1") {
        name = "MODIS Aqua";
        description = "Resolução 250m, revisita 16 dias";
      } else if (cov === "S2-16D-2") {
        name = "Sentinel-2";
        description = "Resolução 10m, revisita 5 dias";
      } else if (cov === "LANDSAT-16D-1") {
        name = "Landsat";
        description = "Resolução 30m, revisita 16 dias";
      }

      return { id: cov, name, description };
    });

    res.json({
      success: true,
      satellites,
      source: "INPE WTSS v4",
    });
  } catch (error) {
    console.error("Erro em listSatellites:", error);
    res.status(500).json({ error: "Erro ao listar satélites" });
  }
}

/**
 * GET /api/satellite/:name/info
 * Descreve um satélite específico (variáveis disponíveis, período, etc.)
 */
export async function getSatelliteInfo(
  req: Request,
  res: Response
): Promise<void> {
  const { name } = req.params;

  try {
    const info = await wtssService.describeCoverage(name);

    if (!info) {
      res.status(404).json({ error: "Satélite não encontrado" });
      return;
    }

    res.json({
      success: true,
      satellite: info,
      source: "INPE WTSS v4",
    });
  } catch (error) {
    console.error("Erro em getSatelliteInfo:", error);
    res.status(500).json({ error: "Erro ao buscar informações do satélite" });
  }
}
