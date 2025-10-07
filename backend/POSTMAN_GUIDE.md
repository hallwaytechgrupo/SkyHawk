# 📬 Guia de Uso - Postman Collection

## 🚀 **Como Importar a Collection no Postman**

### **Passo 1: Abrir o Postman**
1. Abra o Postman Desktop ou Web
2. Clique em **"Import"** (canto superior esquerdo)

### **Passo 2: Importar o Arquivo**
1. Clique em **"Upload Files"**
2. Selecione o arquivo: `SkyHawk-API.postman_collection.json`
3. Clique em **"Import"**

### **Passo 3: Verificar Importação**
✅ Você verá uma pasta chamada **"SkyHawk API - Monitoramento por Satélite"**

---

## 📋 **Estrutura da Collection**

```
SkyHawk API
├── 1. Setup & Health Check
│   └── Health Check
│
├── 2. Listar Satélites
│   ├── Listar Todos os Satélites
│   ├── Informações do MODIS Terra
│   └── Informações do Sentinel-2
│
├── 3. Séries Temporais ⭐ PRINCIPAL
│   ├── Série Temporal - MODIS Terra
│   ├── Série Temporal - Sentinel-2
│   ├── Série Temporal - Landsat
│   └── Série Temporal - EVI
│
├── 4. Comparação de Satélites
│   ├── Comparar MODIS vs Sentinel-2
│   ├── Comparar 3 Satélites
│   └── Comparar MODIS Terra vs Aqua
│
├── 5. Exportação de Dados
│   ├── Exportar como JSON
│   └── Exportar como CSV
│
└── 6. STAC - Coleções e Imagens
    ├── Listar Coleções STAC
    ├── Buscar Imagens por Ponto
    └── Buscar Imagens com Filtros
```

---

## 🎯 **Passo a Passo de Uso (Primeiro Teste)**

### **1. Verificar se a API está online**
📍 **Request:** `1. Setup & Health Check` → `Health Check`

**Como fazer:**
1. Clique em `Health Check`
2. Clique em **"Send"**
3. ✅ Deve retornar: `{ "status": "ok", "timestamp": "..." }`

---

### **2. Listar satélites disponíveis**
📍 **Request:** `2. Listar Satélites` → `Listar Todos os Satélites`

**Como fazer:**
1. Clique em `Listar Todos os Satélites`
2. Clique em **"Send"**
3. ✅ Veja a lista de satélites e seus IDs

**Resposta esperada:**
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

### **3. Obter sua primeira série temporal** ⭐
📍 **Request:** `3. Séries Temporais` → `Série Temporal - MODIS Terra`

**Como fazer:**
1. Clique em `Série Temporal - MODIS Terra`
2. Vá na aba **"Body"** e veja os parâmetros:
   ```json
   {
     "lat": -23.3,
     "lng": -45.96,
     "collection": "mod13q1-6.1",
     "variable": "NDVI",
     "startDate": "2024-01-01",
     "endDate": "2024-10-06"
   }
   ```
3. Clique em **"Send"**
4. ✅ Veja a série temporal retornada!

**Resposta esperada:**
```json
{
  "success": true,
  "data": {
    "timeline": [
      "2024-01-01",
      "2024-01-17",
      "2024-02-02",
      ...
    ],
    "values": [
      0.6523,
      0.7012,
      0.6845,
      ...
    ],
    "metadata": {
      "collection": "mod13q1-6.1",
      "variable": "NDVI",
      "resolution": "250m"
    }
  }
}
```

---

### **4. Comparar múltiplos satélites**
📍 **Request:** `4. Comparação de Satélites` → `Comparar MODIS vs Sentinel-2`

**Como fazer:**
1. Clique em `Comparar MODIS vs Sentinel-2`
2. Veja o body com array de satélites:
   ```json
   {
     "collections": ["mod13q1-6.1", "S2-16D-2"]
   }
   ```
3. Clique em **"Send"**
4. ✅ Veja a comparação lado a lado!

---

### **5. Exportar dados para análise**
📍 **Request:** `5. Exportação de Dados` → `Exportar como CSV`

**Como fazer:**
1. Clique em `Exportar como CSV`
2. Veja os query parameters na URL
3. Clique em **"Send"**
4. ✅ Receba dados em formato CSV!

---

## 🔧 **Personalizando as Requests**

### **Alterar Coordenadas:**
Teste em diferentes locais do Brasil:

| Local | Latitude | Longitude | Descrição |
|-------|----------|-----------|-----------|
| São Paulo | `-23.3` | `-45.96` | Urbano |
| Amazônia | `-3.1` | `-60.0` | Floresta |
| Cerrado (MT) | `-15.5` | `-56.2` | Agricultura |
| Pantanal | `-18.0` | `-56.5` | Área úmida |

**Como alterar:**
1. Clique na request desejada
2. Vá na aba **"Body"**
3. Altere `lat` e `lng`
4. Clique em **"Send"**

---

### **Alterar Satélite:**
Experimente diferentes satélites:

| Satélite | ID | Resolução |
|----------|------|-----------|
| MODIS Terra | `mod13q1-6.1` | 250m |
| MODIS Aqua | `myd13q1-6.1` | 250m |
| Sentinel-2 | `S2-16D-2` | 10m |
| Landsat | `LANDSAT-16D-1` | 30m |

**Como alterar:**
1. Clique na request desejada
2. Vá na aba **"Body"**
3. Altere `collection` para o ID desejado
4. Clique em **"Send"**

---

### **Alterar Variável:**
Experimente diferentes índices:

| Variável | O que mede |
|----------|------------|
| `NDVI` | Índice de vegetação padrão |
| `EVI` | Índice de vegetação melhorado |
| `RED` | Banda vermelha |
| `NIR` | Infravermelho próximo |

**Como alterar:**
1. Vá na aba **"Body"**
2. Altere `variable` para `EVI`, `RED`, etc.
3. Clique em **"Send"**

---

### **Alterar Período:**
Teste diferentes janelas de tempo:

```json
{
  "startDate": "2023-01-01",  // Ano passado
  "endDate": "2024-10-06"      // Até hoje
}
```

```json
{
  "startDate": "2024-06-01",  // Últimos 4 meses
  "endDate": "2024-10-06"
}
```

---

## ✅ **Checklist de Testes**

Use esta ordem para testar tudo:

- [ ] 1. Health Check funcionando
- [ ] 2. Listar satélites disponíveis
- [ ] 3. Ver info de um satélite específico
- [ ] 4. Série temporal MODIS (São Paulo)
- [ ] 5. Série temporal Sentinel-2 (Amazônia)
- [ ] 6. Comparar MODIS vs Sentinel
- [ ] 7. Testar com EVI ao invés de NDVI
- [ ] 8. Exportar como JSON
- [ ] 9. Exportar como CSV
- [ ] 10. Buscar imagens STAC

---

## 🎨 **Visualizando os Dados**

### **Opção 1: Copiar para Excel/Google Sheets**
1. Execute a request
2. Copie o array `timeline` e `values`
3. Cole no Excel
4. Crie um gráfico de linha

### **Opção 2: Usar Postman Visualizer**
No Postman, vá em **"Visualize"** após executar a request para ver os dados formatados.

### **Opção 3: Exportar CSV e plotar**
1. Use o endpoint `/api/export?type=csv`
2. Baixe o CSV
3. Abra no Excel/Google Sheets
4. Crie gráfico de linha

---

## 🐛 **Troubleshooting**

### **Erro: "Connection refused"**
✅ **Solução:** Certifique-se que o servidor está rodando:
```powershell
npm run dev
```

### **Erro: "no coverage named 'XXX'"**
✅ **Solução:** Verifique o nome exato do satélite:
- Use `mod13q1-6.1` (minúsculo)
- Use `S2-16D-2` (maiúsculo S e D)
- Chame `/api/satellites` para ver nomes corretos

### **Erro: "Lat/Lng obrigatórios"**
✅ **Solução:** Certifique-se que está enviando `lat` e `lng` no body (POST) ou query params (GET).

### **Resposta vazia (timeline/values vazios)**
✅ **Possíveis causas:**
- Ponto fora do Brasil (API WTSS cobre apenas Brasil)
- Período sem dados (tente um período maior)
- Satélite específico pode não ter dados para aquele local

---

## 📊 **Interpretando os Resultados**

### **NDVI (Normalized Difference Vegetation Index):**
- **0.0 - 0.2:** Solo nu, rochas, água
- **0.2 - 0.4:** Vegetação esparsa
- **0.4 - 0.7:** Vegetação moderada (agricultura)
- **0.7 - 1.0:** Vegetação densa (florestas)

### **Exemplo prático:**
```json
{
  "timeline": ["2024-01-01", "2024-02-01", "2024-03-01"],
  "values": [0.3, 0.6, 0.8]
}
```

**Interpretação:**
- Janeiro: NDVI 0.3 → Plantio recente
- Fevereiro: NDVI 0.6 → Crescimento da plantação
- Março: NDVI 0.8 → Vegetação saudável

---

## 🚀 **Próximos Passos**

Depois de testar a API:
1. ✅ Criar frontend para visualização
2. ✅ Adicionar banco de dados para salvar consultas
3. ✅ Implementar autenticação (se necessário)
4. ✅ Criar dashboards interativos

---

**Pronto para testar!** 🎉 Importe a collection e comece a explorar os dados de satélite!
