# MODELO DE ESTRUTURA DE DADOS

## Banco de dados

 Conforme o curriculo do semestre, será necessário a implementação de um banco de dados não relacional, utilizando o MongoDB, para tanto foi definido para o projeto o uso do bando de dados para preservação de um log de pesquisas para o sistema implementado, fazendo com que a utilização seja preservada e avaliada para fins de desenvolvimento e manutenção. Sem visualização ou utilização direta pelo usuário foco do projeto.

 ### Documento JSON

 O documento a ser inserido no banco seguira o modelo extraído da API utilizada para desenvolvimento do sistema. A ser inserido no sistema embedding, de forma a relacionar os dados de pesquisa com a data de realização da pesquisa.

 O documento seguira o seguinte modelo (inicialmente, estando sujeito a alterações durante o decorrer do projeto)

 ```
   {
     "date": "2025-02-18T00:00:00z", //exemplo de data
    "data":{
        "geom":{
            "coordinates":[
                -52.63215,
                -28.31698
            ]
            "type": "Point"
        },
        "start_datetime":"2020-01-01:t00:00:00Z",
        "end_datetime":"2020-06-01-T00:00:00Z",
        "results":{
            "timeline": [
                "2018-01-01T00:00:00Z",
                "2018-01-17T00:00:00Z",
                "2018-02-02T00:00:00Z",
                "2018-02-18T00:00:00Z"
                ],
            "values": {
                "EVI": {
                    "mean": [
                        0.365,
                        0.425,
                        0.468,
                        0.563
                        ],
                        "std": [
                            0.394,
                            0.563,
                            0.572,
                            0.63
                            ]
                    },
                    "NDVI": {
                        "mean": [
                            0.365,
                            0.425,
                            0.468,
                            0.563
                            ],
                       "std": [
                            0.394,
                            0.563,
                            0.572,
                            0.63
                            ]
                           }
                        }
                   }
        }
   }
   ``` 
   assim para efeitos de desenvolvimento e manutenção os documentos a serem inseridos no banco, trazem a data da pesquisa e os dados retornados para a pesquisa, ainda em analize se os dados serão salvos a cada pesquisa e a forma como os dados serão enviados para o banco, de forma a não prejudicar a usabilidade do sistema principal, que visa centralizar as informações

### teste de unitario
  Teste de inserção de dados e obtenção de resultados no banco de dados, realizados diretamente no MongoDB utilizando o Prompt Compass - salvos em imagem junto a este documento em ./testeBanco/

