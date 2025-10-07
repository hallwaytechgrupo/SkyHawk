# 🚀 Guia Rápido - Nomes Corretos das Coverages WTSS

## ⚠️ **IMPORTANTE: Case Sensitive!**

Os nomes das coverages WTSS são **case sensitive** (diferenciam maiúsculas de minúsculas).

---

## ✅ **Nomes Corretos (Copie e Cole):**

### **Satélites Principais:**

```
mod13q1-6.1      → MODIS Terra (Índices de Vegetação)
myd13q1-6.1      → MODIS Aqua (Índices de Vegetação)
S2-16D-2         → Sentinel-2 (Alta resolução - 10m)
LANDSAT-16D-1    → Landsat (Histórico desde 1990)
```

### **Outros Satélites Disponíveis:**

```
mod11a2-6.1      → MODIS Terra (Temperatura da Superfície)
myd11a2-6.1      → MODIS Aqua (Temperatura da Superfície)
CBERS4-MUX-2M-1  → CBERS-4 MUX
CBERS4-WFI-16D-2 → CBERS-4 WFI
CBERS-WFI-8D-1   → CBERS WFI (Composto 8 dias)
```

---

## 📊 **Tabela de Referência:**

| Satélite | ID Correto | Variáveis Principais | Resolução | Revisita |
|----------|-----------|---------------------|-----------|----------|
| MODIS Terra | `mod13q1-6.1` | NDVI, EVI, RED, NIR | 250m | 16 dias |
| MODIS Aqua | `myd13q1-6.1` | NDVI, EVI, RED, NIR | 250m | 16 dias |
| Sentinel-2 | `S2-16D-2` | NDVI, EVI, bandas | 10m | 5 dias |
| Landsat | `LANDSAT-16D-1` | NDVI, EVI, bandas | 30m | 16 dias |

---

## 🎯 **Exemplos de Uso:**

### **1. Série Temporal MODIS:**
```json
POST /api/time-series
{
  "lat": -23.3,
  "lng": -45.96,
  "collection": "mod13q1-6.1",  ← minúsculo!
  "variable": "NDVI",
  "startDate": "2024-01-01",
  "endDate": "2024-10-06"
}
```

### **2. Comparar MODIS e Sentinel:**
```json
POST /api/compare
{
  "lat": -23.3,
  "lng": -45.96,
  "collections": ["mod13q1-6.1", "S2-16D-2"],  ← exatamente assim!
  "variable": "NDVI"
}
```

---

## ❌ **Erros Comuns:**

| ❌ Errado | ✅ Correto |
|-----------|-----------|
| `MOD13Q1-6.1` | `mod13q1-6.1` |
| `MYD13Q1-6.1` | `myd13q1-6.1` |
| `s2-16d-2` | `S2-16D-2` |
| `landsat-16d-1` | `LANDSAT-16D-1` |
| `LC8-16D-1` | `LANDSAT-16D-1` |

---

## 🔍 **Como Descobrir Nomes Disponíveis:**

### **Via API:**
```
GET /api/satellites
```

### **Resposta:**
```json
{
  "success": true,
  "satellites": [
    {
      "id": "mod13q1-6.1",
      "name": "MODIS Terra",
      "description": "Resolução 250m, revisita 16 dias"
    },
    ...
  ]
}
```

---

## 📝 **Variáveis Disponíveis por Satélite:**

### **MODIS (mod13q1-6.1 / myd13q1-6.1):**
- `NDVI` - Índice de Vegetação
- `EVI` - Índice de Vegetação Melhorado
- `RED` - Banda Vermelha
- `NIR` - Infravermelho Próximo
- `BLUE` - Banda Azul
- `MIR` - Infravermelho Médio

### **Sentinel-2 (S2-16D-2):**
- `NDVI` - Índice de Vegetação
- `EVI` - Índice de Vegetação Melhorado
- `BAND2` - Azul (490nm)
- `BAND3` - Verde (560nm)
- `BAND4` - Vermelho (665nm)
- `BAND8` - NIR (842nm)

### **Landsat (LANDSAT-16D-1):**
- `NDVI` - Índice de Vegetação
- `EVI` - Índice de Vegetação Melhorado
- `BAND4` - Vermelho
- `BAND5` - NIR

---

## ✅ **Checklist de Teste:**

- [ ] Nomes das coverages estão em lowercase correto (`mod13q1-6.1`)
- [ ] Sentinel-2 está como `S2-16D-2` (maiúsculo S, hífen, maiúsculo D)
- [ ] Landsat está como `LANDSAT-16D-1` (tudo maiúsculo)
- [ ] Variáveis estão corretas (NDVI, EVI, etc.)
- [ ] Coordenadas são válidas (lat: -90 a 90, lng: -180 a 180)
- [ ] Datas no formato `YYYY-MM-DD`

---

**Dica:** Use `GET /api/satellites` para sempre ter os nomes atualizados! 🚀
