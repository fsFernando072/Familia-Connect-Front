# 🖥️ Família Connect — Frontend

> Interface web do sistema de gerenciamento de doações de cestas básicas para famílias carentes, desenvolvida em React com Vite e Tailwind CSS.

---

## 📋 Sobre o Projeto

Este repositório contém o frontend do **Família Connect**, responsável por toda a interface de interação dos funcionários com o sistema. A aplicação consome a API REST do backend (Spring Boot) e o microsserviço de OCR (FastAPI), oferecendo telas de cadastro, listagem e gestão de famílias, funcionários, cargos, produtos, estoque e entregas, além de um dashboard de indicadores (Grafana).

### Principais funcionalidades

- **Login e permissões por cargo** — cada cargo define, por página, um nível de acesso (`VISUALIZACAO`, `LISTAS_CADASTROS` ou `ADMINISTRADOR`). Menu, rotas e botões se adaptam ao que o usuário pode fazer (a segurança de fato é garantida pelo backend, que responde `403`).
- **Famílias** — cadastro, edição e detalhes, com foto (importação e recorte de imagem) e leitura de documentos via OCR.
- **Carteirinha da família** — gerada de forma assíncrona pelo backend; o front acompanha o processamento e exibe notificações de sucesso ou erro, mesmo após recarregar a página.
- **Entregas** — a entrega é iniciada lendo o **QR Code da carteirinha** pela câmera ou, no caso de carteirinha perdida, buscando o responsável pelo **CPF**.
- **Produtos, categorias e estoque** — cadastros e histórico mensal de estoque.
- **Histórico de entregas** — consulta com filtro por mês e paginação.
- **Dashboard** — painéis do Grafana embutidos (visão macro e visão micro por família).

---

## 🛠️ Tecnologias Utilizadas

| Tecnologia | Versão | Descrição |
|---|---|---|
| React | ^19.2.6 | Biblioteca principal de UI |
| Vite | ^8.0.12 | Bundler e servidor de desenvolvimento |
| React Router DOM | ^7.15.1 | Roteamento entre páginas |
| Tailwind CSS | ^4.3.0 | Estilização utilitária |
| Axios | ^1.19.0 | Cliente HTTP para o backend e o OCR |
| Lucide React | ^1.17.0 | Ícones |
| React Easy Crop | ^6.2.3 | Recorte de foto no cadastro de famílias |
| @yudiel/react-qr-scanner | ^2.6.0 | Leitura do QR Code da carteirinha pela câmera |
| ESLint | ^10.3.0 | Análise estática de código |
| Nginx | alpine | Serve o build e faz proxy de `/api/` e `/grafana/` em produção |
| Grafana OSS + plugin Infinity | 12.3.3 | Dashboards embutidos na tela Dashboard |

---

## 📁 Estrutura do Projeto

```
Familia-Connect-Front/
│
├── .github/
│   └── workflows/
│       └── pipeline.yml       # CI (lint + build) e CD (imagens Docker do front e do Grafana)
│
├── grafana/                   # Imagem do Grafana com dashboards e datasource provisionados
│   ├── dashboards/            # familia-connect.json (macro), familia-connect-micro.json e familia-connect-micro-geral.json
│   ├── provisioning/
│   │   ├── dashboards/        # dashboards.yml: manda o Grafana carregar a pasta dashboards/
│   │   └── datasources/       # api.yml: datasource Infinity apontando para a API do backend
│   ├── Dockerfile             # Grafana OSS + plugin Infinity + provisionamento
│   ├── smoke-test.sh          # Sobe a imagem e confere saúde, plugin, datasource e dashboards
│   └── INTEGRACAO-API.md      # Como o Grafana conversa com a API (token, segurança, limitações)
│
├── public/
│   └── env-config.js          # Config de runtime (window.__ENV__), reescrito pelo entrypoint.sh no container
│
├── src/
│   ├── assets/                # Imagens, logos e ícones da página inicial
│   ├── components/            # Componentes reutilizáveis (botões, campos, modais, cartões, layout...)
│   ├── hooks/                 # Hooks customizados (useDebounce, useFeedback, useListaPaginada, useNotificacoesCarteirinha...)
│   ├── pages/                 # Páginas da aplicação (uma pasta por tela: Lista*, Cadastro*, Editar*, Entrega, Dashboard...)
│   ├── routes/
│   │   ├── index.jsx              # Definição das rotas (React Router)
│   │   ├── navegacaoPrincipal.js  # Itens do menu lateral e atalhos da página inicial
│   │   ├── nomesRotas.js          # Mapeamento de rotas para nomes/títulos exibidos
│   │   └── permissoesRotas.js     # Regras que ligam rota → página de permissão → ação
│   ├── services/              # Chamadas à API (apiClient, serviços por entidade, permissões, OCR, Grafana)
│   ├── utils/                 # Formatadores, máscaras, validadores, recorte de imagem, sessão...
│   ├── App.jsx                # Componente raiz
│   ├── App.module.css
│   ├── index.css
│   └── main.jsx               # Ponto de entrada da aplicação
│
├── index.html                 # HTML base
├── vite.config.js             # Configuração do Vite (inclui proxy de /grafana em desenvolvimento)
├── eslint.config.js           # Configuração do ESLint
├── nginx.conf                 # Template do Nginx (servir o build, proxy de /api/ e include do proxy do Grafana)
├── entrypoint.sh              # Gera env-config.js e a configuração do Nginx a partir das variáveis do container
├── Dockerfile                 # Build (Node 24) + imagem final (Nginx)
├── docker-compose.yml         # Sobe o front e o Grafana
├── .env.example               # Modelo das variáveis de ambiente
├── AGENTS.md                  # Guia rápido do projeto para agentes de código
├── package.json
└── .gitignore
```

---

## ⚙️ Pré-requisitos

- [Node.js 18+](https://nodejs.org/) (o Dockerfile e o CI usam Node 24)
- [npm](https://www.npmjs.com/) ou [yarn](https://yarnpkg.com/)
- [Docker](https://www.docker.com/) e Docker Compose (para rodar a imagem e o Grafana)
- Backend do Família Connect rodando localmente ou em nuvem

---

## 🔧 Variáveis de Ambiente

### Desenvolvimento local (`npm run dev` / `npm run build` sem Docker)

Crie um arquivo `.env` na raiz do projeto (há um modelo em `.env.example`). Para rodar só o front, basta:

```env
VITE_API_BASE_URL=http://localhost:8080/api
```

| Variável | Obrigatória | Padrão | Descrição |
|---|---|---|---|
| `VITE_API_BASE_URL` | ❌ Não | `http://localhost:8080/api` | URL base da API do backend (Spring Boot) consumida pelo `apiClient` (Axios) |
| `VITE_GRAFANA_DASHBOARD_URL` | ❌ Não | — | Link do dashboard do Grafana na tela Dashboard (ver seção abaixo) |
| `GRAFANA_DEV_URL` | ❌ Não | `http://localhost:80` | Destino do proxy `/grafana` do Vite em desenvolvimento |

Por serem variáveis do Vite, os valores `VITE_*` são embutidos no bundle em tempo de build — úteis localmente, mas não são o que roda em produção (ver abaixo).

### 🐳 Produção / Docker — configuração em runtime

Em produção o `apiClient` **não depende de uma variável de build do Vite**. O `index.html` carrega `public/env-config.js`, que expõe `window.__ENV__`; o `entrypoint.sh` **reescreve esse arquivo a cada início do container** com base nas variáveis de ambiente. Assim, dá para trocar a URL da API (ou do dashboard) só reiniciando o container, **sem rebuildar a imagem**.

| Variável | Obrigatória | Padrão no `docker-compose.yml` | Descrição |
|---|---|---|---|
| `BACKEND_URL` | ✅ Sim (o container não sobe sem ela) | `http://host.docker.internal:8080` | Endereço interno do backend. O Nginx encaminha `/api/` para ele |
| `API_BASE_URL` | ❌ Não | `/api` | URL que o navegador usa para chamar a API (`window.__ENV__.API_BASE_URL`). Com o proxy do Nginx, o padrão `/api` já funciona |
| `GRAFANA_URL` | ❌ Não | `http://grafana:3000` | Endereço interno do Grafana. Se definido, o Nginx expõe o Grafana em `/grafana/` na mesma origem do front |
| `GRAFANA_DASHBOARD_URL` | ✅ Para a tela Dashboard funcionar | `/grafana/d/familia-connect/familia-connect-visao-geral?orgId=1` | Link do dashboard exibido na tela Dashboard (`window.__ENV__.GRAFANA_DASHBOARD_URL`) |

> A ordem de prioridade no `apiClient` é: `window.__ENV__.API_BASE_URL` (runtime/Docker) → `import.meta.env.VITE_API_BASE_URL` (build local) → `http://localhost:8080/api` (default).

```bash
docker run -p 80:80 \
  -e BACKEND_URL=http://back:8080 \
  familia-connect-front
```

Com Docker Compose (sobe o front **e** o Grafana), copie `.env.example` para `.env`, preencha os valores e rode:

```bash
docker-compose up --build
```

As variáveis lidas pelo Compose a partir do `.env` são:

| Variável | Obrigatória | Descrição |
|---|---|---|
| `GRAFANA_API_TOKEN` | ✅ Sim (o Compose não sobe sem ela) | Segredo compartilhado entre o Grafana e o backend (`GRAFANA_API_TOKEN` também no Spring Boot). **Nunca** use prefixo `VITE_` nem exponha no navegador |
| `GRAFANA_ADMIN_PASSWORD` | Recomendada | Senha do usuário admin do Grafana (padrão do compose: `admin`) |
| `GRAFANA_BACKEND_URL` | ❌ Não | Endereço do backend visto **de dentro do container do Grafana** (padrão: `http://host.docker.internal:8080`) |
| `GRAFANA_ROOT_URL` | ❌ Não | URL pública do Grafana sob `/grafana/` (padrão: `http://localhost/grafana/`) |
| `BACKEND_URL`, `API_BASE_URL`, `GRAFANA_URL`, `GRAFANA_DASHBOARD_URL` | ❌ Não | Descritas na tabela anterior |

---

## 📊 Dashboard (Grafana)

A tela **Dashboard** (`/dashboard`, `src/pages/Dashboard`) embute painéis do **Grafana** via `iframe`, no mesmo layout das demais telas (menu lateral, breadcrumb, cartão). Os gráficos e consultas são montados no próprio Grafana; o front cuida do enquadramento, da escolha da visão, do seletor de período e dos botões **Atualizar** / **Abrir no Grafana**. O acesso segue a permissão `DASHBOARD` do cargo (a mesma que controla o item do menu).

A tela tem duas visões:

- **Visão Macro** — panorama geral do atendimento, cobertura e distribuição de recursos.
- **Visão Micro** — acompanhamento de famílias prioritárias e do histórico de uma família. Sem família selecionada, mostra a visão micro geral; ao buscar uma família pelo nome do responsável e selecioná-la, o front troca para o dashboard individual e passa o id pela variável `var_familiaId`.

O front acrescenta ao link `kiosk` (esconde o menu do Grafana) e `theme=light`; ao escolher um período no seletor, acrescenta também `from=<período>&to=now`. "Padrão do painel" não altera o período salvo no dashboard. Sem `GRAFANA_DASHBOARD_URL`, a tela mostra o aviso "Dashboard indisponível" em vez do painel.

### Como funciona a integração: Grafana → API → MySQL

O Grafana **não acessa o banco diretamente**. Ele usa o plugin **Infinity** para chamar a API do backend, que executa consultas SQL fixas (no `GrafanaMetricasController`) com o datasource da própria aplicação. A cada chamada o Grafana envia o cabeçalho `X-Grafana-Token`, preenchido no servidor a partir de `GRAFANA_API_TOKEN` (`grafana/provisioning/datasources/api.yml`). O token protege apenas a API de métricas — não a interface do Grafana.

Mais detalhes (e limitações conhecidas) em [`grafana/INTEGRACAO-API.md`](grafana/INTEGRACAO-API.md).

### Dashboards provisionados

A imagem do Grafana (`grafana/Dockerfile`) já embute os dashboards e o datasource, carregados automaticamente ao subir:

| Dashboard | UID | Painéis |
|---|---|---|
| Família Connect \| Visão Macro | `familia-connect` | famílias cadastradas · famílias atendidas no período · itens entregues no período · taxa de atendimento · evolução mensal de entregas e famílias atendidas · bairros com mais famílias (top 10) · produtos mais entregues (top 10) · famílias atendidas × sem atendimento |
| Família Connect — Visão Micro Geral | `familia-connect-micro-geral` | famílias sem entrega no período · famílias com prioridade · itens entregues no período · famílias prioritárias sem atendimento · famílias há mais tempo sem entrega (meses) · itens entregues por funcionário · acompanhamento das famílias prioritárias |
| Família Connect \| Visão Micro | `familia-connect-micro` | (variável `var_familiaId`) itens recebidos no período · pessoas na família · dias desde a última entrega · produtos recebidos · últimas entregas |

> Os dashboards são somente leitura na interface (`allowUiUpdates: false`): para alterar um painel, edite o JSON em `grafana/dashboards/` (ou exporte do Grafana em *Share → Export*) e faça o commit. O Grafana recarrega os arquivos em até 30 s.

### Proxy do Grafana atrás do Nginx do front (`/grafana/`)

Com `GRAFANA_URL` definido, o `entrypoint.sh` gera o proxy `/grafana/` no Nginx. Assim o `iframe` fica na mesma origem do sistema (sem problemas de cookie `SameSite`/CORS). Antes de cada requisição, o Nginx consulta `GET /api/funcionarios/me` no backend (`auth_request`) e devolve `401` se a sessão não for válida.

```bash
docker run -p 80:80 \
  -e BACKEND_URL=http://back:8080 \
  -e GRAFANA_URL=http://grafana:3000 \
  -e GRAFANA_DASHBOARD_URL=/grafana/d/familia-connect/familia-connect-visao-geral?orgId=1 \
  familia-connect-front
```

Se você usa o seu próprio Grafana em vez do que vem no `docker-compose.yml`, ele precisa de:

```env
GF_SERVER_ROOT_URL=https://SEU-FRONT/grafana/
GF_SERVER_SERVE_FROM_SUB_PATH=true
GF_SECURITY_ALLOW_EMBEDDING=true
GF_AUTH_ANONYMOUS_ENABLED=true
GF_AUTH_ANONYMOUS_ORG_ROLE=Viewer
```

além do plugin `yesoreyeram-infinity-datasource` e do datasource provisionado (use `grafana/provisioning` como base).

> ⚠️ Com acesso anônimo ligado, **não exponha a porta do Grafana publicamente**: ele deve ser alcançável apenas pelo container do front (rede interna). O `docker-compose.yml` já não publica a porta 3000 por esse motivo.
>
> ⚠️ **Valide a proteção do iframe antes de ir para produção.** O `auth_request` depende de o Nginx receber a credencial de sessão do usuário na requisição do iframe; se o backend usar JWT guardado fora de cookie, esse mecanismo pode não autenticar corretamente (ver `grafana/INTEGRACAO-API.md`).
>
> ℹ️ O Nginx resolve o endereço de `GRAFANA_URL` ao iniciar: se o host não existir na rede, o container do front não sobe. Se não quiser usar o proxy, deixe `GRAFANA_URL` vazio.

### Alternativa: Grafana em outro domínio

Defina só `GRAFANA_DASHBOARD_URL` com a URL absoluta. O Grafana precisa permitir `iframe` (`GF_SECURITY_ALLOW_EMBEDDING=true`) e o usuário precisa conseguir abrir o painel sem tela de login dentro do `iframe` (acesso anônimo `Viewer`, ou HTTPS com `GF_SECURITY_COOKIE_SAMESITE=none` e `GF_SECURITY_COOKIE_SECURE=true`). Nesse modo o Grafana não passa pela checagem de login do sistema.

### Desenvolvimento com o Vite

Para usar o Dashboard em `http://localhost:5173/dashboard`, suba o Compose (Grafana na porta 80) e rode `npm run dev`: o `vite.config.js` encaminha `/grafana` para `GRAFANA_DEV_URL` (padrão `http://localhost:80`).

### Teste da imagem do Grafana

```bash
docker build -t familia-connect-grafana:test ./grafana
./grafana/smoke-test.sh familia-connect-grafana:test
```

O script sobe a imagem e confere saúde do Grafana, plugin Infinity, datasource, carregamento de todos os dashboards e acesso anônimo. O mesmo teste roda no CI.

---

## 🚀 Como Iniciar

### 1. Clone o repositório

```bash
git clone https://github.com/fsFernando072/Familia-Connect-Front.git
cd Familia-Connect-Front
```

### 2. Instale as dependências

```bash
npm install
```

### 3. Inicie o servidor de desenvolvimento

```bash
npm run dev
```

A aplicação estará disponível em: **http://localhost:5173**

> O backend precisa estar rodando (padrão `http://localhost:8080`). Para usar o OCR, o serviço FastAPI também deve estar no ar.

---

## 📦 Scripts Disponíveis

| Comando | Descrição |
|---|---|
| `npm run dev` | Inicia o servidor de desenvolvimento com HMR |
| `npm run build` | Gera o build de produção em `/dist` |
| `npm run preview` | Serve o build de produção localmente |
| `npm run lint` | Executa o ESLint para análise de código |

---

## 🔗 Integração com os Outros Serviços

Este frontend depende dos seguintes repositórios do projeto:

| Serviço | Repositório | Porta padrão |
|---|---|---|
| Backend (Spring Boot) | [Familia-Connect-Back](https://github.com/fsFernando072/Familia-Connect-Back) | 8080 |
| OCR (FastAPI) | [Familia-Connect-OCR](https://github.com/fsFernando072/Familia-Connect-OCR) | 8000 |
| Banco de Dados (MySQL) | [Familia-Connect-BD](https://github.com/fsFernando072/Familia-Connect-BD) | 3306 |

O front chama o backend (autenticação por sessão com `withCredentials`) e envia imagens de documentos para o endpoint `/ocr`. O Grafana consome o backend pelas rotas de métricas, usando `GRAFANA_API_TOKEN`.

---

## 🤝 Contribuindo

1. Faça um fork do projeto
2. Crie uma branch para sua feature: `git checkout -b feature/minha-feature`
3. Commit suas alterações: `git commit -m 'feat: adiciona minha feature'`
4. Push para a branch: `git push origin feature/minha-feature`
5. Abra um Pull Request

---

## 🤖 CI/CD

O workflow em `.github/workflows/pipeline.yml` roda no GitHub Actions e tem três jobs:

- **`build` (CI)** — a cada `push` ou `pull request` para `main` (e também no disparo manual): instala as dependências (Node.js 24), roda `npm run lint` e depois `npm run build`.
- **`docker-front` (CD)** — disparado manualmente (`workflow_dispatch`, com a versão da imagem como parâmetro), após o `build` passar: builda a imagem Docker do front e publica no Docker Hub (`fsfernando072/familia-connect-front`), taggeada com a versão informada e também como `latest`.
- **`grafana`** — builda a imagem do Grafana (`./grafana`) e roda o `smoke-test.sh` a cada execução do workflow; no disparo manual, publica também no Docker Hub (`fsfernando072/familia-connect-grafana`) com a versão informada e `latest`.

> Requer os secrets `DOCKERHUB_USERNAME` e `DOCKERHUB_TOKEN` configurados no ambiente `development` do repositório.
>
> Como a URL da API é resolvida em **runtime** (via `API_BASE_URL`/`BACKEND_URL` + `entrypoint.sh`), a mesma imagem publicada pelo CD serve para qualquer ambiente — basta variar as variáveis no `docker run`/`docker-compose.yml` de cada ambiente, sem rebuildar a imagem.

---

## 📄 Licença

Este projeto está sob a licença MIT. Consulte o arquivo [LICENSE](LICENSE) para mais detalhes.