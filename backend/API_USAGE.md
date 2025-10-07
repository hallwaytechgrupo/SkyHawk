# 🚀 SkyHawk API - Guia de Uso

## 📡 Endpoints Disponíveis

### 1. **Listar Satélites Disponíveis**
```http
GET /api/satellites
```

**Resposta:**
```json
{
  "success": true,
  "satellites": [
    { "id": "mod13q1-6.1", "name": "MODIS Terra", "description": "Resolução 250m, revisita 16 dias" },
    { "id": "myd13q1-6.1", "name": "MODIS Aqua", "description": "Resolução 250m, revisita 16 dias" },
    { "id": "S2-16D-2", "name": "Sentinel-2", "description": "Resolução 10m, revisita 5 dias" },
    { "id": "LANDSAT-16D-1", "name": "Landsat", "description": "Resolução 30m, revisita 16 dias" }
  ],
  "source": "INPE WTSS v4"
}
```

---

### 2. **Informações de um Satélite**
```http
GET /api/satellite/mod13q1-6.1/info
```

**Resposta:**
```json
{
  "success": true,
  "satellite": {
    "name": "mod13q1-6.1",
    "description": "MODIS Vegetation Indices",
    "spatial_extent": { ... },
    "temporal_extent": ["2000-02-18", "2024-10-01"],
    "attributes": ["NDVI", "EVI", "RED", "NIR", "BLUE", "MIR"],
    "resolution": { "x": 231.656, "y": 231.656 }
  }
}
```

---

### 3. **Obter Série Temporal** ⭐ **PRINCIPAL**
```http
POST /api/time-series
Content-Type: application/json

{
  "lat": -23.3,
  "lng": -45.96,
  "collection": "MOD13Q1-6.1",
  "variable": "NDVI",
  "startDate": "2024-01-01",
  "endDate": "2024-10-06"
}
```

**Resposta:**
```json
{
  "success": true,
  "data": {
    "timeline": [
      "2024-01-01", "2024-01-17", "2024-02-02", ...
    ],
    "values": [
      0.6523, 0.7012, 0.6845, 0.7234, ...
    ],
    "metadata": {
      "collection": "mod13q1-6.1",
      "variable": "NDVI",
      "resolution": "250m"
    }
  },
  "source": "INPE WTSS v4"
}
```

---

### 4. **Comparar Múltiplos Satélites**
```http
POST /api/compare
Content-Type: application/json

{
  "lat": -23.3,
  "lng": -45.96,
  "collections": ["mod13q1-6.1", "S2-16D-2"],
  "variable": "NDVI",
  "startDate": "2024-01-01",
  "endDate": "2024-10-06"
}
```

**Resposta:**
```json
{
  "success": true,
  "comparison": [
    {
      "satellite": "mod13q1-6.1",
      "timeline": ["2024-01-01", ...],
      "values": [0.65, 0.70, ...],
      "variable": "NDVI"
    },
    {
      "satellite": "S2-16D-2",
      "timeline": ["2024-01-01", ...],
      "values": [0.68, 0.72, ...],
      "variable": "NDVI"
    }
  ],
  "source": "INPE WTSS v4"
}
```

---

### 5. **Exportar Dados (JSON/CSV)**
```http
GET /api/export?lat=-23.3&lng=-45.96&collections=mod13q1-6.1,S2-16D-2&variable=NDVI&startDate=2024-01-01&endDate=2024-10-06&type=csv
```

**Retorna CSV:**
```csv
Satellite,Date,Value
mod13q1-6.1,2024-01-01,0.6523
mod13q1-6.1,2024-01-17,0.7012
S2-16D-2,2024-01-01,0.6845
...
```

---

## 🛰️ **Satélites e Variáveis**

### **MODIS Terra (mod13q1-6.1)**
- **Resolução:** 250m
- **Revisita:** 16 dias
- **Variáveis:** `NDVI`, `EVI`, `RED`, `NIR`, `BLUE`, `MIR`
- **Período:** 2000-2024

### **Sentinel-2 (S2-16D-2)**
- **Resolução:** 10m
- **Revisita:** 5 dias
- **Variáveis:** `NDVI`, `EVI`, `BAND2`, `BAND3`, `BAND4`, `BAND8`
- **Período:** 2015-2024

### **Landsat (LANDSAT-16D-1)**
- **Resolução:** 30m
- **Revisita:** 16 dias
- **Variáveis:** `NDVI`, `EVI`, `BAND4`, `BAND5`
- **Período:** 2013-2024

---

## 📊 **O que é NDVI?**

**NDVI** = Normalized Difference Vegetation Index

- **Faixa:** -1 a +1
- **Interpretação:**
  - `-1 a 0`: Água, neve, nuvens
  - `0 a 0.2`: Solo nu, rochas
  - `0.2 a 0.4`: Vegetação esparsa
  - `0.4 a 0.7`: Vegetação moderada
  - `0.7 a 1.0`: Vegetação densa/saudável

---

## 🎯 **Fluxo Recomendado para Frontend**

1. **Usuário clica no mapa** → Pega `lat` e `lng`
2. **Chama `/api/satellites`** → Mostra lista de satélites
3. **Usuário escolhe satélite(s)** → Ex: MODIS
4. **Chama `/api/time-series`** → Recebe dados
5. **Plota gráfico** com Chart.js/Recharts

---

## ✅ **Exemplos Práticos**

### **Caso 1: Monitorar plantação**
```json
POST /api/time-series
{
  "lat": -23.3,
  "lng": -45.96,
  "collection": "mod13q1-6.1",
  "variable": "NDVI",
  "startDate": "2023-01-01",
  "endDate": "2024-10-06"
}
```
→ Retorna série de 2 anos para ver evolução da plantação

### **Caso 2: Comparar resoluções**
```json
POST /api/compare
{
  "lat": -23.3,
  "lng": -45.96,
  "collections": ["mod13q1-6.1", "S2-16D-2"],
  "variable": "NDVI"
}
```
→ Compara MODIS (250m) com Sentinel-2 (10m)

---

## 🔧 **Troubleshooting**

### **Erro: "Resposta vazia"**
- Verifique se o ponto está no Brasil
- Verifique se há dados para o período (pode não ter imagens)
- Tente outro satélite

### **Erro: "Coverage not found"**
- Use nomes exatos: `mod13q1-6.1`, `S2-16D-2`, `LANDSAT-16D-1` (case sensitive!)
- Chame `/api/satellites` para ver nomes disponíveis

---

**Pronto para testar!** 🎉
