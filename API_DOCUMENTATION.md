# OZmap API - Documentação Técnica (Desafio Técnico)

## Requisitos Implementados

### Requisitos Principais

- **CRUD completo para regiões**: Endpoints para criar, ler, atualizar e deletar regiões
- **Consultas geoespaciais**: 
  - Listar regiões contendo um ponto específico
  - Listar regiões a uma determinada distância de um ponto
  - Buscar regiões que contém um endereço específico

### Diferenciais Implementados

- **Internacionalização**: Suporte para três idiomas (pt-BR, en, es)
- **Padrões REST**: Rotas seguindo as melhores práticas REST
- **Documentação**: Documentação técnica e coleção Postman
- **Testes**: Testes unitários e de integração com cobertura > 90%
- **Logging**: Sistema de logs com Winston
- **Script de Seed**: Script para popular o banco com regiões
- **Docker**: Configuração para execução em container

## Stack Tecnológica

- **Backend**: Node.js, TypeScript, Express, Mongoose
- **Banco de Dados**: MongoDB (com suporte geoespacial)
- **Internacionalização**: i18next
- **Logging**: Winston
- **Testes**: Mocha, Chai, Sinon, NYC

## Requisitos Implementados

### Requisitos Principais

- **CRUD completo para regiões**: Implementação de endpoints para criar, ler, atualizar e deletar regiões geográficas
- **Consultas geoespaciais**: 
  - Listar regiões contendo um ponto específico
  - Listar regiões a uma determinada distância de um ponto
  - Buscar regiões que contém um endereço específico

### Diferenciais Implementados

- **Internacionalização**: Suporte para três idiomas (pt-BR, en, es)
- **Padrões REST**: Rotas seguindo as melhores práticas REST (substantivos no plural, uso adequado de verbos HTTP)
- **Documentação**: Documentação técnica completa e coleção Postman
- **Testes**: Testes unitários e de integração com cobertura superior a 90%
- **Logging**: Sistema de logs abrangente usando Winston
- **Script de Seed**: Script para popular o banco de dados com regiões de cidades brasileiras
- **Docker**: Configuração para execução em container

## Configuração do Ambiente

### Pré-requisitos

- Node.js (versão 14 ou superior)
- Docker e Docker Compose
- MongoDB (versão 5+)

### Variáveis de Ambiente

A aplicação utiliza as seguintes variáveis de ambiente, que podem ser configuradas no arquivo `.env`:

```
PORT=3000                     # Porta em que a API será executada
NODE_ENV=development          # Ambiente de execução (development, production)
COUNTRY_CODE=BR               # Código do país para buscas de endereço (padrão: BR)

MONGO_URI=mongodb://localhost:27017/ozmap  # URI de conexão com o MongoDB
MONGO_INITDB_ROOT_HOST=localhost           # Host do MongoDB
MONGO_INITDB_ROOT_PORT=27017               # Porta do MongoDB
MONGO_INITDB_DATABASE=ozmap                # Nome do banco de dados
```

### Instalação e Execução

1. Clone o repositório
2. Instale as dependências:
   ```bash
   yarn install
   ```
3. Configure o arquivo `.env` com as variáveis necessárias
4. Inicie o container do MongoDB:
   ```bash
   docker-compose up -d
   ```
5. Execute o script de seed para popular o banco com dados iniciais:
   ```bash
   yarn seed
   ```
6. Inicie a aplicação:
   ```bash
   yarn dev
   ```

## Internacionalização

A API suporta internacionalização em três idiomas:

- Português do Brasil (pt-BR) - padrão
- Inglês (en)
- Espanhol (es)

O idioma pode ser especificado de três maneiras em **qualquer endpoint** da API:

1. Parâmetro de consulta: `?lang=pt-BR`
2. Cookie: `i18next=pt-BR`
3. Cabeçalho HTTP: `Accept-Language: pt-BR`

> **Nota**: Não é necessário usar um endpoint específico para enviar o header de idioma. Qualquer requisição para qualquer endpoint pode incluir o parâmetro de consulta, o cookie ou o cabeçalho HTTP para especificar o idioma desejado.
>
> Além disso, a API também oferece endpoints específicos para gerenciar o idioma (ver seção [Gerenciamento de Idiomas](#gerenciamento-de-idiomas)), que são úteis para persistir a preferência de idioma do usuário.

## Endpoints da API

A API segue os padrões REST, conforme solicitado, utilizando substantivos no plural para recursos e verbos HTTP adequados para indicar ações. Todos os endpoints estão disponíveis para teste na coleção Postman incluída no projeto.

### Resumo dos Endpoints

#### Health Check
- `GET /api/health` - Verifica o status da API

#### Gerenciamento de Idiomas
- `GET /api/language/current` - Retorna o idioma atual e os idiomas suportados
- `POST /api/language/change` - Altera o idioma atual

#### Gerenciamento de Regiões (CRUD)
- `GET /api/regions` - Lista todas as regiões
- `GET /api/regions/:id` - Retorna uma região específica
- `POST /api/regions` - Cria uma nova região
- `PUT /api/regions/:id` - Atualiza uma região existente
- `DELETE /api/regions/:id` - Remove uma região existente

#### Consultas Geoespaciais
- `POST /api/regions/coordinates` - Busca regiões que contém um ponto específico
- `POST /api/regions/address` - Busca regiões que contém um endereço específico
- `POST /api/regions/distance` - Busca regiões a uma determinada distância de um ponto

### Formato das Respostas

Todas as respostas seguem um formato padronizado:

```json
{
  "status": "success",  // ou "error" em caso de falha
  "message": "Mensagem descritiva",
  "results": 5,
  "data": [...]  // dados retornados (opcional)
}
```

## Coleção Postman

O projeto inclui uma coleção Postman completa (`postman_collection.json`) com exemplos de requisições para todos os endpoints da API. Esta coleção facilita o teste e a validação da API sem necessidade de escrever código adicional.

Para utilizar:

1. Importe o arquivo `postman_collection.json` no Postman
2. Certifique-se de que a API está em execução (`yarn dev`)
3. Execute as requisições diretamente do Postman

## Modelos de Dados

### Region

| Campo    | Tipo            | Descrição                              |
| -------- | --------------- | -------------------------------------- |
| \_id     | ObjectId        | Identificador único da região          |
| name     | String          | Nome da região                         |
| geometry | GeoJSON Polygon | Geometria da região em formato GeoJSON |

#### Formato GeoJSON Polygon

```json
{
  "type": "Polygon",
  "coordinates": [
    [
      [longitude1, latitude1],
      [longitude2, latitude2],
      ...,
      [longitudeN, latitudeN],
      [longitude1, latitude1]
    ]
  ]
}
```

**Observações importantes:**

- As coordenadas são representadas como arrays de [longitude, latitude] (nesta ordem)
- O polígono deve ser fechado (o primeiro e último ponto devem ser idênticos)
- As coordenadas devem formar um polígono válido (sem auto-interseções)

## Script de Seed

A API inclui um script de seed para popular o banco de dados com dados iniciais de regiões geográficas de cidades brasileiras. Este script facilita o início rápido da aplicação com dados realistas para testes e demonstrações.

### Regiões Incluídas

O script popula o banco de dados com as seguintes regiões:

1. Centro de São Paulo
2. Zona Sul de São Paulo
3. Centro do Rio de Janeiro
4. Centro de Belo Horizonte
5. Região Metropolitana de Curitiba

Cada região possui um polígono geográfico definido com coordenadas de longitude e latitude.

### Execução do Script

Para executar o script de seed e popular o banco de dados:

```bash
yarn seed
```

Este comando deve ser executado após a configuração do ambiente e antes de iniciar a aplicação para garantir que os dados iniciais estejam disponíveis.

## Sistema de Logs

A API implementa um sistema de logs abrangente usando **Winston**, uma das bibliotecas de logging mais populares para Node.js. O sistema foi implementado seguindo o padrão Singleton para garantir consistência em toda a aplicação.

### Implementação

O sistema de logs foi configurado em `src/config/logger.ts` e utiliza os seguintes recursos:

- **Formato JSON**: Logs estruturados em formato JSON para facilitar análise e processamento
- **Múltiplos transportes**: Logs são enviados para console e arquivos
- **Níveis de log**: Suporte para diferentes níveis (error, warn, info, http, debug)
- **Rotação de arquivos**: Arquivos de log são rotacionados automaticamente

### Localização dos Logs

Os logs são armazenados nos seguintes arquivos:

- `logs/all.log`: Contém todos os logs da aplicação
- `logs/error.log`: Contém apenas logs de erro
- `logs/requests.log`: Contém logs de todas as requisições HTTP

### Eventos Registrados

O sistema de logs registra automaticamente:

- Inicialização e encerramento da aplicação
- Todas as requisições HTTP (método, URL, status, tempo de resposta)
- Erros de requisição e respostas com status de erro
- Operações de CRUD em regiões
- Validações de dados e erros de validação
- Operações de banco de dados

### Integração com Express

O middleware `express-winston` foi utilizado para integrar o logger com o Express, permitindo o registro automático de todas as requisições HTTP.

## Tratamento de Erros

A API implementa um sistema de tratamento de erros centralizado que utiliza códigos de status HTTP padronizados e retorna mensagens de erro estruturadas e internacionalizadas:

```json
{
  "status": "error",
  "message": "Mensagem de erro específica"
}
```

Os erros são capturados por um middleware global (`errorHandler`) que garante consistência nas respostas e registra todos os erros no sistema de logs.

### Códigos de Status Utilizados

- `200 OK`: Requisição bem-sucedida
- `201 Created`: Recurso criado com sucesso
- `400 Bad Request`: Erro de validação ou requisição inválida
- `404 Not Found`: Recurso não encontrado
- `409 Conflict`: Conflito (ex: região com mesmo nome já existe)
- `500 Internal Server Error`: Erro interno do servidor

## Testes

A API possui uma cobertura de testes abrangente, com foco em testes unitários e de integração. A cobertura de código atual é superior a 90%.

### Estrutura de Testes

- **Testes Unitários**: Localizados em `tests/unit/`, testam componentes isoladamente
  - `services/regionService.test.ts`: Testes para o serviço de regiões

- **Testes de Integração**: Localizados em `tests/integration/`, testam a interação entre componentes
  - `routes/regionRoutes.test.ts`: Testes para as rotas CRUD de regiões
  - `routes/regionSpecialRoutes.test.ts`: Testes para as rotas especiais (coordenadas, endereço, distância)

### Ferramentas Utilizadas

- **Mocha**: Framework de testes
- **Chai**: Biblioteca de asserções
- **Sinon**: Biblioteca para mocks e stubs
- **NYC**: Ferramenta para medir cobertura de código

### Execução dos Testes

Para executar os testes:

```bash
yarn test
```

Para executar os testes com relatório de cobertura:

```bash
yarn test:coverage
```

## Sistema de Logs

A API implementa um sistema de logs abrangente usando Winston, que registra informações importantes sobre o funcionamento da aplicação. Os logs são essenciais para monitoramento, depuração e auditoria.

### Implementação

O sistema de logs foi implementado seguindo o padrão Singleton, garantindo que uma única instância do logger seja utilizada em toda a aplicação. Isso proporciona consistência nos formatos e níveis de log em todos os componentes do sistema.

### Níveis de Log

- **error**: Erros críticos que afetam o funcionamento da aplicação
- **warn**: Avisos sobre situações potencialmente problemáticas
- **info**: Informações gerais sobre o funcionamento da aplicação
- **http**: Detalhes sobre requisições HTTP
- **debug**: Informações detalhadas para depuração (apenas em ambiente de desenvolvimento)

### Localização dos Logs

Os logs são armazenados nos seguintes arquivos:

- `logs/all.log`: Contém todos os logs da aplicação
- `logs/error.log`: Contém apenas logs de erro
- `logs/requests.log`: Contém logs de todas as requisições HTTP

Além disso, todos os logs são exibidos no console durante a execução da aplicação.

### Eventos Registrados

O sistema de logs registra automaticamente:

- Inicialização e encerramento da aplicação
- Todas as requisições HTTP (método, URL, status, tempo de resposta)
- Erros de requisição e respostas com status de erro
- Operações de CRUD em regiões (criação, leitura, atualização, exclusão)
- Validações de dados e erros de validação
- Operações de banco de dados

### Exemplo de Log

```
2025-05-19T18:30:01.910Z [INFO] Server running on port 3000
2025-05-19T18:30:01.912Z [INFO] API available at http://localhost:3000/api
2025-05-19T18:30:05.123Z [INFO] Attempting to create region: Região Centro de São Paulo
2025-05-19T18:30:05.456Z [INFO] Region created successfully: Região Centro de São Paulo, ID: 6457b3e1c9e4b2a1d8f0e9c7
```

### Middleware de Logging

A API utiliza o middleware Express/Winston para registrar automaticamente todas as requisições HTTP e suas respostas, incluindo:

- Método HTTP
- URL
- Status da resposta
- Tempo de resposta
- IP do cliente
- User-Agent

Este middleware é configurado para registrar logs no formato JSON, facilitando a análise e processamento por ferramentas de monitoramento.

## Validações

A API implementa diversas validações para garantir a integridade dos dados:

### Validações de Região

- **Nome**: Obrigatório, string com pelo menos 3 caracteres
- **Geometria**: Obrigatória, deve ser um polígono GeoJSON válido
- **Coordenadas**: Devem formar um polígono fechado (primeiro e último ponto idênticos)
- **Formato do Polígono**: Não deve ter auto-interseções

### Validações de Requisições

- **Coordenadas**: Para endpoints que aceitam coordenadas, estas devem ser um ponto GeoJSON válido
- **Endereço**: Para o endpoint de busca por endereço, o endereço deve ter pelo menos 5 caracteres
- **Distância**: Para o endpoint de busca por distância, o valor deve ser um número positivo

## Códigos de Erro

Além dos códigos de status HTTP padrão, a API retorna mensagens de erro específicas:

| Código | Descrição | Exemplo de Mensagem |
|--------|-----------|---------------------|
| 400 | Requisição inválida | "Nome da região é obrigatório" |
| 400 | Geometria inválida | "Geometria deve ser um polígono GeoJSON válido" |
| 400 | Parâmetros inválidos | "Distância deve ser um número positivo" |
| 404 | Região não encontrada | "Região com ID {id} não encontrada" |
| 404 | Endereço não encontrado | "Não foi possível geocodificar o endereço fornecido" |
| 409 | Conflito | "Já existe uma região com este nome" |
| 500 | Erro interno | "Erro ao processar a requisição" |

## Testes

A API possui uma suíte de testes abrangente que garante seu correto funcionamento. Os testes estão divididos em duas categorias:

### Testes Unitários

Os testes unitários focam em testar cada componente isoladamente, substituindo dependências externas por mocks. Eles estão localizados no diretório `tests/unit/` e podem ser executados com o comando:

```bash
yarn test
```

### Testes de Integração

Os testes de integração verificam a interação entre os diferentes componentes da aplicação, incluindo os endpoints da API. Eles estão localizados no diretório `tests/integration/` e são executados junto com os testes unitários.

### Cobertura de Testes

Para verificar a cobertura de testes, execute:

```bash
yarn test:coverage
```

Este comando gera um relatório detalhado de cobertura, indicando quais partes do código estão sendo testadas e quais precisam de mais testes.

## Script de Seed

A aplicação inclui um script de seed que popula o banco de dados com 5 regiões geográficas brasileiras:

1. Região Centro de São Paulo
2. Zona Sul de São Paulo
3. Zona Norte do Rio de Janeiro
4. Centro de Belo Horizonte
5. Região Metropolitana de Curitiba

Cada região possui um polígono geográfico definido com coordenadas de longitude e latitude. O script pode ser executado com o comando:

```bash
yarn seed
```

---

Esta documentação foi criada como parte do desafio técnico da OZmap. Para mais informações, consulte o [README principal](./README.md).
