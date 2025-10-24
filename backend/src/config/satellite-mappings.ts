export const SATELLITE_NAME_MAPPING: Record<string, string> = {
  // Frontend → WTSS API
  landsat8: "LANDSAT-16D-1",
  landsat: "LANDSAT-16D-1",
  sentinel2: "S2-16D-2",
  "sentinel-2": "S2-16D-2",
  s2: "S2-16D-2",
  "modis-terra": "mod13q1-6.1",
  "modis-aqua": "myd13q1-6.1",
};

export function normalizeSatelliteName(name: string): string {
  const normalized = name.toLowerCase();
  return SATELLITE_NAME_MAPPING[normalized] || name;
}
