
### 🗺️ Interação com o mapa (RF01)
**Como** pesquisador geoespacial  
**Eu quero** clicar em um ponto do mapa interativo ou inserir coordenadas geográficas  
**Para que** eu possa selecionar rapidamente uma área de interesse para análise de dados de satélite

---

### 🛰️ Listagem de satélites e variáveis disponíveis (RF02)
**Como** estudante de geociências  
**Eu quero** visualizar uma lista de satélites com dados gratuitos disponíveis para a área selecionada  
**Para que** eu possa entender quais missões oferecem dados relevantes e suas resoluções espaciais e temporais

---

### 📊 Comparação de séries temporais (RF03)
**Como** analista ambiental  
**Eu quero** comparar visualmente séries temporais de variáveis similares de diferentes satélites  
**Para que** eu possa escolher o produto mais adequado para minha análise, como o NDVI do Sentinel-2 versus Landsat-8

---

### 🔍 Filtragem e exportação de dados (RF04)
**Como** profissional de geoprocessamento  
**Eu quero** filtrar os dados por satélite, variável ou período de tempo e exportar os metadados e dados brutos/processados  
**Para que** eu possa realizar análises mais específicas e utilizar os dados em outras ferramentas


---

### 🧭 Interface intuitiva (RNF01)
**Como** usuário sem experiência prévia em geoprocessamento  
**Eu quero** navegar por uma interface clara e intuitiva  
**Para que** eu consiga utilizar a plataforma sem dificuldades técnicas

---

### ⚡ Desempenho otimizado (RNF02)
**Como** usuário da plataforma  
**Eu quero** que o mapa e os dados carreguem rapidamente e que a interação seja fluida  
**Para que** eu não perca tempo esperando ou enfrentando travamentos durante a análise

---

### 📈 Escalabilidade (RNF03)
**Como** administrador da plataforma  
**Eu quero** que a aplicação suporte um número crescente de usuários e fontes de dados  
**Para que** o sistema continue funcional e eficiente conforme a demanda aumenta

---

### ✅ Confiabilidade dos dados (RNF04)
**Como** pesquisador acadêmico  
**Eu quero** ter certeza de que os dados exibidos são precisos, atualizados e corretamente atribuídos às suas fontes  
**Para que** eu possa confiar nos resultados obtidos para publicações e decisões técnicas

---

### 🆓 Uso exclusivo de dados gratuitos (RP01)
**Como** desenvolvedor da aplicação  
**Eu quero** utilizar apenas dados de satélites gratuitos como Landsat, Sentinel e MODIS  
**Para que** a plataforma seja acessível a todos os usuários sem custos adicionais

---

### ⏳ Escopo viável para alunos (RP02)
**Como** estudante desenvolvedor  
**Eu quero** delimitar claramente o escopo do projeto  
**Para que** eu consiga entregar um produto mínimo viável dentro do tempo disponível

---

### 💾 Limites de infraestrutura (RP03)
**Como** responsável técnico  
**Eu quero** considerar as limitações de recursos computacionais e de armazenamento  
**Para que** o sistema funcione bem mesmo com infraestrutura modesta

---
---
# Backlog:

## 🏁 Sprint 1 — Planejamento e protótipo funcional

| Código     | Tarefa                                                                 | Definition of Ready                                                                 | Definition of Done                                                                 |
|------------|------------------------------------------------------------------------|--------------------------------------------------------------------------------------|-------------------------------------------------------------------------------------|
| GAP-0001   | Planejamento inicial e definição do escopo do sistema                 | Equipe reunida, desafio compreendido, metas iniciais definidas                      | Documento de escopo validado e compartilhado com todos os membros                  |
| GAP-0002   | Planejamento inicial e definição do escopo do sistema                 | Equipe reunida, desafio compreendido, metas iniciais definidas                      | Documento de escopo validado e compartilhado com todos os membros                  |
| GAP-0003   | Estruturação da arquitetura geral e tecnologias utilizadas            | Tecnologias escolhidas, escopo definido                                             | Diagrama da arquitetura e stack documentada                                        |
| GAP-0004   | Modelagem dos componentes principais e definição dos entregáveis      | Escopo e arquitetura definidos                                                      | Modelos de componentes e backlog inicial criado                                    |
| IHC-0001   | Desenvolvimento de protótipo no Figma                                  | Escopo visual definido, requisitos funcionais mapeados                              | Protótipo navegável no Figma com telas principais                                  |
| IHC-0004   | Definição de fluxos de navegação intuitivos                            | Protótipo inicial criado                                                            | Fluxos validados com base em heurísticas de usabilidade                            |
| TC-0001    | Implementação da seleção de ponto no mapa interativo                  | Protótipo funcional, biblioteca de mapa definida                                    | Clique no mapa retorna coordenadas corretamente                                    |
| TC-0002    | Integração com APIs de satélites para consulta de metadados           | API definida e acessível, coordenadas disponíveis                                   | Dados de satélite retornados corretamente para ponto selecionado                   |
| BDN-0001   | Modelagem de estrutura de metadados de satélites                      | Requisitos de dados definidos                                                       | Estrutura criada no MongoDB e validada com dados simulados                         |
| DW-0001    | Criação da interface do mapa interativo com seleção por clique        | Protótipo validado, biblioteca de mapa integrada                                    | Mapa funcional com interação de clique                                              |
| DW-0002    | Exibição dinâmica de satélites e variáveis disponíveis                | API integrada, estrutura de dados pronta                                            | Lista de satélites e variáveis exibida corretamente após seleção                   |

---

## 🚀 Sprint 2 — Comparação visual e testes de usabilidade

| Código     | Tarefa                                                                 | Definition of Ready                                                                 | Definition of Done                                                                 |
|------------|------------------------------------------------------------------------|--------------------------------------------------------------------------------------|-------------------------------------------------------------------------------------|
| GAP-0005   | Implementação e execução de testes unitários e de integração          | Funcionalidades desenvolvidas e documentadas                                        | Testes automatizados executados com cobertura mínima definida                      |
| GAP-0006   | Validação dos requisitos funcionais com base nos testes               | Testes executados e resultados disponíveis                                          | Checklist de requisitos validado com base nos testes                               |
| GAP-0007   | Ajustes técnicos e refinamento do backlog                             | Feedback dos testes e usuários coletado                                             | Backlog atualizado com melhorias e correções priorizadas                           |
| IHC-0002   | Testes de usabilidade com usuários                                     | Protótipo funcional disponível                                                      | Relatório de usabilidade com insights e sugestões                                   |
| IHC-0003   | Refinamento da interface com base no feedback                          | Relatório de usabilidade analisado                                                  | Interface ajustada e validada com novo teste rápido                                |
| TC-0003    | Desenvolvimento da lógica de comparação de séries temporais           | Dados disponíveis e estrutura de séries pronta                                      | Comparação funcional entre séries de diferentes satélites                          |
| TC-0004    | Implementação de filtros por satélite, variável e período             | Interface e dados prontos                                                           | Filtros aplicáveis e funcionais na interface                                       |
| BDN-0002   | Armazenamento de séries temporais e variáveis geoespaciais            | Estrutura de dados definida                                                         | Dados armazenados corretamente e acessíveis via API                                |
| BDN-0003   | Implementação de filtros e consultas eficientes                       | Dados armazenados e filtros definidos                                               | Consultas otimizadas e testadas com diferentes parâmetros                          |
| DW-0003    | Visualização lado a lado de séries temporais em gráficos              | Dados comparáveis disponíveis                                                       | Gráficos exibindo corretamente as séries selecionadas                              |
| DW-0004    | Implementação de filtros e painel de controle                         | Filtros definidos e interface preparada                                             | Painel funcional com filtros aplicáveis e responsivos                              |

---

## 🎯 Sprint 3 — Exportação, otimizações e entrega final

| Código     | Tarefa                                                                 | Definition of Ready                                                                 | Definition of Done                                                                 |
|------------|------------------------------------------------------------------------|--------------------------------------------------------------------------------------|-------------------------------------------------------------------------------------|
| GAP-0008   | Testes de performance, escalabilidade e confiabilidade                | Sistema funcional completo                                                          | Relatório de testes com métricas de desempenho e confiabilidade                    |
| GAP-0009   | Documentação técnica do sistema e dos endpoints                       | Funcionalidades estáveis e validadas                                                | Documentação publicada e acessível para desenvolvedores e usuários                 |
| GAP-0010   | Preparação para entrega final e apresentação do sistema               | Sistema testado e documentado                                                       | Sistema implantado, apresentação preparada e entregue                              |
| IHC-0005   | Design responsivo para diferentes dispositivos                         | Interface final definida                                                            | Layout adaptado e testado em diferentes resoluções                                 |
| TC-0005    | Exportação de dados e metadados em formatos compatíveis               | Dados disponíveis e estrutura de exportação definida                                | Exportação funcional em formatos como CSV ou JSON                                  |
| BDN-0004   | Estratégia de cache para otimizar performance                         | Dados acessados com frequência identificados                                        | Cache implementado e validado com melhoria de tempo de resposta                    |
| BDN-0005   | Garantia de integridade e atualização dos dados                       | Estrutura de dados e fontes definidas                                               | Validação automática de dados e atualização periódica implementada                 |
| DW-0005    | Otimização de carregamento e responsividade                           | Interface final pronta                                                              | Sistema leve, rápido e responsivo em diferentes dispositivos                       |

---
