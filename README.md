# Banco API Automation

Projeto de automação de testes para a API **banco-api**.

A API utilizada como sistema sob teste foi desenvolvida por **Júlio de Lima**.  
Os testes automatizados deste repositório foram implementados de forma **independente** por mim, com foco em prática de automação de APIs, validação de contrato, cenários negativos e organização de suíte de testes.

## Objetivo do repositório

Este repositório tem como objetivo demonstrar, na prática:

- automação de testes de API com Node.js
- uso de **Mocha**, **Chai** e **Supertest**
- organização de helpers, factories e cenários parametrizados
- validação de fluxos positivos e negativos
- análise crítica de divergências entre comportamento observado e contrato documentado no Swagger
- construção de portfólio técnico em Engenharia de Qualidade

Este README também foi escrito para permitir que qualquer pessoa consiga **subir a aplicação localmente e executar os testes** com o mínimo de atrito possível.

---

## Sistema sob teste

A aplicação alvo possui endpoints REST e GraphQL voltados para operações financeiras. Entre os fluxos disponíveis, estão:

- autenticação de usuário
- consulta de contas
- transferências entre contas

Neste repositório, o foco atual está na automação de cenários da **API REST**, principalmente nos endpoints:

- `POST /login`
- `POST /transferencias`

A documentação interativa da API REST está disponível via Swagger em:

```bash
http://localhost:3000/api-docs
```

---

## Tecnologias e bibliotecas utilizadas

### Aplicação e execução
- **Node.js**
- **Express**
- **MySQL**

### Automação de testes
- **Mocha** — runner de testes
- **Chai** — biblioteca de asserções
- **Supertest** — testes de API HTTP
- **Mochawesome** — geração de relatórios HTML e JSON

### Apoio ao projeto
- **dotenv** — carregamento de variáveis de ambiente
- **jsonwebtoken** — geração e validação de token JWT
- **mysql2** — conexão com banco de dados

---

## Pré-requisitos

Antes de executar o projeto, tenha instalado na sua máquina:

- **Node.js**
- **npm**
- **MySQL**

### Versões recomendadas

Se possível, utilize:

- **Node.js 18+**
- **npm 9+**
- **MySQL 8+**

> O projeto pode funcionar em outras versões, mas essa faixa tende a reduzir incompatibilidades locais.

---

## Estrutura atual do projeto

```plaintext
.
├── src/
├── test/
│   ├── factories/
│   │   └── transfers.factory.js
│   ├── specs/
│   │   ├── login.spec.js
│   │   └── transfers.spec.js
│   └── utils/
│       ├── auth.js
│       ├── db-helper.js
│       ├── env.js
│       └── ...
├── .env
├── package.json
└── README.md
```

> A estrutura pode evoluir conforme novos endpoints, helpers e cenários forem sendo automatizados.

---

## Como rodar o projeto localmente

Siga esta ordem.

### 1. Clone o repositório

```bash
git clone https://github.com/HenriquePatti/banco-api-automation.git
cd banco-api-automation
```

### 2. Instale as dependências

```bash
npm install
```

### 3. Crie o banco de dados MySQL

No seu MySQL local, crie o banco com o nome esperado pelo projeto:

```sql
CREATE DATABASE banco;
USE banco;

CREATE TABLE contas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    titular VARCHAR(100) NOT NULL,
    saldo DECIMAL(10, 2) NOT NULL,
    ativa BOOLEAN DEFAULT TRUE
);

CREATE TABLE transferencias (
    id INT AUTO_INCREMENT PRIMARY KEY,
    conta_origem_id INT NOT NULL,
    conta_destino_id INT NOT NULL,
    valor DECIMAL(10, 2) NOT NULL,
    data_hora DATETIME DEFAULT CURRENT_TIMESTAMP,
    autenticada BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (conta_origem_id) REFERENCES contas(id),
    FOREIGN KEY (conta_destino_id) REFERENCES contas(id)
);

CREATE TABLE usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    senha VARCHAR(255) NOT NULL
);
```

> Se você quiser usar outro nome, ajuste também a variável `DB_NAME` no arquivo `.env`.

### 4. Crie o arquivo `.env`

Crie um arquivo `.env` na raiz do projeto.

Exemplo:

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=banco
JWT_SECRET=sua_chave_secreta
PORT=3000
GRAPHQLPORT=3001
TEST_USERNAME=usuario_teste
TEST_SENHA=senha_teste
BASE_URL=http://localhost:3000
```

---

## Variáveis de ambiente

Abaixo está o significado de cada variável e como preenchê-la.

| Variável | Obrigatória | Exemplo | Como preencher | Finalidade |
|---|---|---|---|---|
| `DB_HOST` | Sim | `localhost` | Host do seu MySQL local | Conexão com banco |
| `DB_USER` | Sim | `root` | Usuário do MySQL local | Conexão com banco |
| `DB_PASSWORD` | Sim | vazio ou `minhaSenha` | Se seu MySQL usa senha, informe aqui. Se o usuário não tiver senha, deixe vazio | Conexão com banco |
| `DB_NAME` | Sim | `banco` | Nome do banco criado localmente | Conexão com banco |
| `JWT_SECRET` | Sim | `sua_chave_secreta` | Defina uma chave qualquer para uso local | Assinatura e validação do JWT |
| `PORT` | Sim | `3000` | Porta desejada para API REST | Execução local |
| `GRAPHQLPORT` | Sim | `3001` | Porta desejada para API GraphQL | Execução local |
| `TEST_USERNAME` | Sim | `usuario_teste` | Usuário válido existente na base | Usado pelos testes de login/autenticação |
| `TEST_SENHA` | Sim | `senha_teste` | Senha do usuário definido em `TEST_USERNAME` | Usado pelos testes de login/autenticação |
| `BASE_URL` | Sim | `http://localhost:3000` | URL base da API REST local | Usado pelo Supertest nos testes |

### Observações importantes sobre o `.env`

#### `BASE_URL`
Para rodar localmente no cenário padrão, use:

```env
BASE_URL=http://localhost:3000
```

Se você alterar a porta da API REST em `PORT`, atualize o `BASE_URL` para refletir essa mudança.

Exemplo:
- se `PORT=3000` → `BASE_URL=http://localhost:3000`
- se `PORT=4000` → `BASE_URL=http://localhost:4000`

#### `DB_PASSWORD`
Você deve preencher com a senha real do seu MySQL local.

Exemplos:
- se o seu usuário `root` **não usa senha**, deixe:
  ```env
  DB_PASSWORD=
  ```
- se o seu usuário `root` usa senha, por exemplo `123456`, use:
  ```env
  DB_PASSWORD=123456
  ```

#### `TEST_USERNAME` e `TEST_SENHA`
Essas variáveis precisam apontar para um **usuário real da aplicação**, existente no banco de dados.

Elas são usadas pelos testes automatizados para fazer login e obter o token JWT.

#### `JWT_SECRET`
Pode ser qualquer valor para seu ambiente local, por exemplo:

```env
JWT_SECRET=minha_chave_local_123
```

> Nunca versione credenciais reais no repositório.

---

## Como obter usuário e senha da aplicação

Essa é uma parte importante.

Os testes de login e autenticação precisam de um usuário válido da aplicação.  
Por isso, `TEST_USERNAME` e `TEST_SENHA` **não podem ficar vazios** se você quiser executar a suíte completa.

### Opção 1 — Verificar se o projeto já popula um usuário de teste
Antes de criar manualmente, verifique se a base local, o script de reset ou os scripts SQL do projeto já criam usuários automaticamente.

Se já existir um usuário conhecido na tabela `usuarios`, basta usar essas credenciais no `.env`:

```env
TEST_USERNAME=usuario_existente
TEST_SENHA=senha_existente
```

### Opção 2 — Criar manualmente um usuário de teste no banco
Se a base não vier populada com um usuário válido, você deve criar um usuário na tabela correspondente da aplicação.

O caminho mais seguro é:

1. subir a aplicação localmente
2. verificar no código ou no banco qual tabela armazena usuários
3. inserir manualmente um usuário de teste no banco com username e senha conhecidos
4. usar esses mesmos valores em `TEST_USERNAME` e `TEST_SENHA`

Exemplo conceitual:

```env
TEST_USERNAME=qa_teste
TEST_SENHA=123456
```

### Como descobrir isso de forma prática

#### A. Inspecionar o banco de dados
Abra seu MySQL e verifique se existem usuários cadastrados:

```sql
USE banco;
SELECT * FROM usuarios;
```

Se existir um usuário válido, use esse par de credenciais no `.env`.

#### B. Consultar os scripts SQL do projeto
Se houver arquivo de seed, reset ou carga inicial, veja se ele cria registros de usuário e quais valores são usados.

#### C. Criar um usuário de teste específico
Se não existir nenhum, crie um usuário apenas para testes e documente localmente as credenciais usadas.

> Se a senha da aplicação for armazenada com hash, você não poderá inserir texto puro arbitrariamente sem seguir a mesma regra usada pela API. Nesse caso, o ideal é localizar um usuário já existente na base, usar um seed conhecido ou criar o usuário pelo próprio fluxo da aplicação, se existir.

---

## Ordem recomendada de configuração

Para evitar erro de ambiente, siga esta ordem:

1. instalar dependências com `npm install`
2. criar o banco `banco` no MySQL
3. criar e preencher o `.env`
4. garantir que existe um usuário válido da aplicação para `TEST_USERNAME` e `TEST_SENHA`
5. subir a API REST
6. validar acesso ao Swagger
7. executar os testes

---

## Como subir a aplicação

### API REST

```bash
npm run rest-api
```

Após subir a API REST, você pode acessar:

```bash
http://localhost:3000/api-docs
```

### API GraphQL

```bash
npm run graphql-api
```

> Mesmo que o projeto possua GraphQL, a cobertura atual deste repositório está mais concentrada na API REST.

---

## Como executar os testes

### Rodar toda a suíte automatizada

```bash
npm run test
```

### Resetar a base de dados

```bash
npm run db:reset
```

Esse comando é útil para restaurar a base antes de executar cenários que dependem de estado inicial previsível.

---

## Relatórios de execução

A suíte gera relatórios com **Mochawesome**.

Ao final da execução, os arquivos de evidência ficam disponíveis para consulta em formato HTML e JSON, permitindo:

- leitura dos cenários executados
- inspeção de falhas
- evidência visual de execução da suíte

---

## Cobertura atual implementada

## Login (`POST /login`)

### Cenários positivos
- autenticação com credenciais válidas e retorno de token

### Validação de nomes de campos inválidos
- envio de nome inválido para `username`
- envio de nome inválido para `senha`

### Validação de campos obrigatórios
- body vazio
- requisição sem body
- ausência do campo `username`
- ausência do campo `senha`

### Validação de conteúdo obrigatório inválido
- `username` vazio
- `senha` vazia

### Validação de credenciais inválidas
- usuário inválido
- senha inválida

### Validação de métodos não suportados
- `GET`
- `PUT`
- `PATCH`
- `DELETE`

---

## Transferências (`POST /transferencias`)

### Cenários positivos
- transferência com valor mínimo permitido
- transferência com valor intermediário válido
- transferência dentro da faixa sem token adicional

### Cenários negativos
- valores abaixo de R$ 10,00
- transferências acima do limite sem token adicional
- ausência de campos obrigatórios
- análise de divergências entre comportamento observado e contrato esperado

> Parte dos cenários de transferência está em evolução e também está sendo usada para registro de bugs e inconsistências de contrato da API.

---

## Regras de negócio consideradas nos testes

Com base na documentação atual da API, algumas regras relevantes já observadas são:

- `username` e `senha` são obrigatórios no login
- o token JWT possui expiração configurada de **1 hora**
- o valor mínimo para transferências é **R$ 10,00**
- transferências acima de **R$ 5.000,00** exigem token adicional
- contas de origem e destino devem existir e estar ativas
- falhas de validação devem retornar respostas coerentes com o contrato documentado

---

## Defeitos e divergências identificadas

Durante a automação, os seguintes bugs foram identificados na API.
Os testes que evidenciam cada defeito estão na suíte `test/specs/transfers.spec.js`.

---

### BUG-01 — Regra de valor limite incorreta no endpoint de transferências

**Endpoint:** `POST /transferencias`
**Severidade:** Alta
**Tipo:** Regra de negócio

| | Detalhe |
|---|---|
| **Comportamento esperado** | Transferências com `valor > 5000` devem exigir token adicional |
| **Comportamento observado** | A API exige token adicional para `valor >= 5000`, bloqueando transferências legítimas de exatamente R$ 5.000 |
| **Status recebido** | `401` |
| **Status esperado** | `201` |
| **Teste que evidencia** | `deve realizar transferência com valor máximo de R$ 5000` |

---

### BUG-02 — Status code incorreto ao bloquear transferências acima do limite

**Endpoint:** `POST /transferencias`
**Severidade:** Média
**Tipo:** Contrato HTTP

| | Detalhe |
|---|---|
| **Comportamento esperado** | Transferências acima de R$ 5.000 sem token adicional devem retornar `403` (usuário autenticado, sem permissão) |
| **Comportamento observado** | A API retorna `401` (não autorizado), indicando que o usuário não está autenticado — o que é incorreto, pois o token JWT foi enviado |
| **Status recebido** | `401` |
| **Status esperado** | `403` |
| **Teste que evidencia** | `deve retornar 403 quando o valor for maior que R$ 5000 sem token adicional` |

---

### BUG-03 — Campos obrigatórios ausentes retornam 404 em vez de 400

**Endpoint:** `POST /transferencias`
**Severidade:** Alta
**Tipo:** Validação de contrato

| | Detalhe |
|---|---|
| **Comportamento esperado** | Ausência dos campos `contaOrigem` ou `contaDestino` deve retornar `400 Bad Request` com mensagem de validação |
| **Comportamento observado** | A API retorna `404 Not Found`, indicando que tenta buscar a conta no banco antes de validar os campos obrigatórios |
| **Status recebido** | `404` |
| **Status esperado** | `400` |
| **Testes que evidenciam** | `deve retornar 400 quando o parametro contaOrigem não for informado` e `deve retornar 400 quando o parametro contaDestino não for informado` |

---

### BUG-04 — Ausência do campo `valor` causa erro interno (500)

**Endpoint:** `POST /transferencias`
**Severidade:** Crítica
**Tipo:** Tratamento de erro

| | Detalhe |
|---|---|
| **Comportamento esperado** | Ausência do campo `valor` deve retornar `400 Bad Request` com mensagem de validação |
| **Comportamento observado** | A API não trata a ausência do campo e lança uma exceção interna, retornando `500 Internal Server Error` |
| **Status recebido** | `500` |
| **Status esperado** | `400` |
| **Teste que evidencia** | `deve retornar 400 quando o parametro valor não for informado` |

---

## Abordagem de testes

A estratégia adotada busca combinar:

- cenários positivos e negativos
- cobertura orientada por risco
- validação de contrato HTTP
- uso de factories para dados de entrada
- helpers para autenticação, ambiente e reset de base
- parametrização de cenários repetitivos para reduzir duplicação e melhorar manutenção

---

## Próximos passos

Entre os próximos incrementos planejados para o repositório:

- expandir cobertura de transferências
- organizar documentação detalhada dos cenários implementados em arquivo `.md` próprio
- incluir mais evidências de bugs e divergências de contrato
- evoluir a padronização da suíte
- ampliar cobertura para outros endpoints relevantes da aplicação

---

## Observação importante sobre autoria

Este repositório **não é o código-fonte original da API banco-api**.

A aplicação usada como sistema sob teste foi desenvolvida por **Júlio de Lima**.

O foco deste projeto está na criação e evolução de uma suíte de **testes automatizados independente**, construída por mim para fins de prática, estudo, análise técnica.
