# 🖥️ Família Connect — Frontend

> Interface web do sistema de gerenciamento de doações de cestas básicas para famílias carentes, desenvolvida em React com Vite e Tailwind CSS.

---

## 📋 Sobre o Projeto

Este repositório contém o frontend do **Família Connect**, responsável por toda a interface de interação dos funcionários com o sistema. A aplicação consome a API REST do backend (Spring Boot) e o microsserviço de OCR (FastAPI), oferecendo telas de cadastro, listagem e gestão de famílias, pessoas, funcionários e entregas.

---

## 🛠️ Tecnologias Utilizadas

| Tecnologia | Versão | Descrição |
|---|---|---|
| React | 19.2.6 | Biblioteca principal de UI |
| Vite | 8.0.12 | Bundler e servidor de desenvolvimento |
| React Router DOM | 7.15.1 | Roteamento entre páginas |
| Tailwind CSS | 4.3.0 | Estilização utilitária |
| Chart.js | 4.5.1 | Biblioteca de gráficos |
| React Chart.js 2 | 5.3.1 | Wrapper React para Chart.js |
| Recharts | 3.8.1 | Componentes de gráficos para React |
| ESLint | 10.3.0 | Análise estática de código |

---

## 📁 Estrutura do Projeto

```
Familia-Connect-Front/
│
├── .github/
│   └── workflows/            # Pipeline de CI/CD
│
├── src/
│   ├── assets/                # Imagens e ícones
│   ├── components/            # Componentes reutilizáveis (botões, inputs, cards...)
│   ├── hooks/                 # Hooks customizados (ex.: useDebounce)
│   ├── pages/                 # Páginas da aplicação (uma por rota)
│   ├── routes/
│   │   └── nomesRotas.js      # Mapeamento de rotas para nomes/títulos exibidos
│   ├── services/               # Chamadas à API (Axios)
│   ├── utils/                  # Formatadores, máscaras e validadores
│   ├── App.jsx                 # Componente raiz
│   ├── App.module.css
│   ├── index.css
│   ├── main.jsx                # Ponto de entrada da aplicação
│   └── routes.jsx              # Definição das rotas (React Router)
│
├── public/
│   └── env-config.js          # Config de runtime (window.__ENV__), reescrito pelo entrypoint.sh no container
│
├── index.html                 # HTML base
├── vite.config.js             # Configuração do Vite
├── eslint.config.js           # Configuração do ESLint
├── nginx.conf                 # Configuração do Nginx (servir o build em produção)
├── entrypoint.sh              # Gera env-config.js a partir de API_BASE_URL antes de subir o nginx
├── Dockerfile
├── docker-compose.yml
├── package.json
└── .gitignore
```

---

## ⚙️ Pré-requisitos

- [Node.js 18+](https://nodejs.org/)
- [npm](https://www.npmjs.com/) ou [yarn](https://yarnpkg.com/)
- Backend do Família Connect rodando localmente ou em nuvem

---

## 🔧 Variáveis de Ambiente

### Desenvolvimento local (`npm run dev` / `npm run build` sem Docker)

Crie um arquivo `.env` na raiz do projeto com base no exemplo abaixo:

```env
VITE_API_BASE_URL=http://localhost:8080/api
```

| Variável | Obrigatória | Padrão | Descrição |
|---|---|---|---|
| `VITE_API_BASE_URL` | ❌ Não | `http://localhost:8080/api` | URL base da API do backend (Spring Boot) consumida pelo `apiClient` (Axios) |

Por ser uma variável do Vite (prefixo `VITE_`), esse valor é embutido no bundle em tempo de build — útil localmente, mas não é o que roda em produção (ver abaixo).

### 🐳 Produção / Docker — configuração em runtime

Em produção o `apiClient` **não depende mais de uma variável de build do Vite**. O `index.html` carrega um arquivo `public/env-config.js`, que expõe `window.__ENV__.API_BASE_URL`; o `apiClient` lê esse valor primeiro (e só cai para `VITE_API_BASE_URL`/default se ele não existir).

Esse arquivo é **gerado pelo `entrypoint.sh` a cada início do container**, a partir da variável de ambiente `API_BASE_URL` — ou seja, dá para trocar a URL da API só reiniciando o container com outro valor, **sem precisar rebuildar a imagem**.

| Variável | Onde é usada | Obrigatória | Padrão | Descrição |
|---|---|---|---|---|
| `API_BASE_URL` | Container (runtime) | ❌ Não | `` (vazio, cai no default do `apiClient`) | URL base da API repassada para `window.__ENV__.API_BASE_URL` pelo `entrypoint.sh` |

```bash
docker run -e API_BASE_URL=https://api.seudominio.com -p 80:80 familia-connect-front
```

Ou, com Docker Compose, defina `API_BASE_URL` no `.env` da raiz do projeto — o `docker-compose.yml` já repassa essa variável para o container automaticamente:

```bash
docker-compose up --build
```

> A ordem de prioridade no `apiClient` é: `window.__ENV__.API_BASE_URL` (runtime/Docker) → `import.meta.env.VITE_API_BASE_URL` (build local) → `http://localhost:8080/api` (default).

---

## 📊 Dashboard (Grafana)

A tela **Dashboard** (`/dashboard`, `src/pages/Dashboard`) embute um painel do **Grafana** via `iframe`, no mesmo layout das demais telas (menu lateral, breadcrumb, cartão). Os gráficos e consultas são montados no próprio Grafana; o front só cuida do enquadramento, do seletor de período e dos botões **Atualizar** / **Abrir no Grafana**. O acesso segue a permissão `DASHBOARD` do cargo (a mesma que já controla o item do menu).

### Variáveis

| Variável | Onde é usada | Obrigatória | Descrição |
|---|---|---|---|
| `GRAFANA_DASHBOARD_URL` | Container (runtime) | ✅ Sim, para a tela funcionar | Link do dashboard no Grafana (Share → Link). Pode ser relativo (`/grafana/d/abc123/familia-connect?orgId=1`) ou absoluto. Vai para `window.__ENV__.GRAFANA_DASHBOARD_URL` |
| `VITE_GRAFANA_DASHBOARD_URL` | Dev local (`npm run dev`) | ❌ Não | Equivalente da anterior no `.env` do Vite. Só vale se `window.__ENV__.GRAFANA_DASHBOARD_URL` estiver vazio |
| `GRAFANA_URL` | Container (runtime) | ❌ Não | Endereço interno do Grafana (ex.: `http://grafana:3000`, sem barra no final). Se definido, o Nginx expõe o Grafana em `/grafana/` na mesma origem do front |

Sem `GRAFANA_DASHBOARD_URL`, a tela mostra o aviso "Dashboard indisponível" em vez do painel.

O front acrescenta ao link `kiosk` (esconde o menu do Grafana) e `theme=light`; ao escolher um período no seletor, acrescenta também `from=<período>&to=now`. "Padrão do painel" não altera o período salvo no dashboard.

### Dashboard pronto (provisionado)

O repositório já traz o dashboard **"Família Connect — Visão geral"** e a conexão com o banco, que o Grafana carrega sozinho ao subir (pasta `grafana/`):

```
grafana/
├── dashboards/familia-connect.json                 # o dashboard (28 painéis)
├── provisioning/datasources/mysql.yml              # conexão com o MySQL (via variáveis de ambiente)
├── provisioning/dashboards/dashboards.yml          # manda o Grafana carregar a pasta acima
└── sql/usuario-somente-leitura.sql                 # cria o usuário de leitura do Grafana no MySQL
```

**Como subir**

1. No MySQL do Família Connect, rode `grafana/sql/usuario-somente-leitura.sql` (troque `NOME_DO_BANCO` e a senha). O usuário só enxerga as colunas usadas pelos painéis: **sem CPF, RG, telefone, nome das pessoas atendidas ou senhas**, e sem permissão de escrita.
2. Copie `.env.example` para `.env` e preencha `GRAFANA_DB_*` e `GRAFANA_ADMIN_PASSWORD`.
3. `docker-compose up -d`. O compose já sobe o Grafana, liga o proxy `/grafana/` e aponta a tela Dashboard para o painel.

> O dashboard é somente leitura na interface (`allowUiUpdates: false`): para alterar um painel, edite `familia-connect.json` (ou exporte do Grafana em *Share → Export*) e commite. O Grafana recarrega o arquivo em até 30 s.

**O que o dashboard mostra**

| Seção | Indicadores |
|---|---|
| Visão geral (KPIs) | famílias cadastradas · pessoas cadastradas · famílias com prioridade · famílias atendidas no mês · famílias pendentes no mês · cobertura do mês (%) · itens entregues no mês · média de itens por família · itens entregues no período · saldo de estoque do mês · produtos esgotados · produtos com estoque baixo (≥ 80% usado) |
| Entregas | itens entregues e famílias atendidas por mês · itens por categoria · itens por dia · itens por dia da semana · produtos mais entregues (top 10) · entregas por funcionário (top 10) |
| Estoque do mês atual | tabela por produto (cadastrado, entregue, saldo e % usado, os mais críticos primeiro) · saldo por categoria · entradas de estoque × itens entregues por mês |
| Perfil das famílias | novas famílias por mês · famílias por tamanho · pessoas por faixa etária · pessoas por sexo · famílias com/sem prioridade · bairros com mais famílias · profissão dos responsáveis |

Regras usadas (as mesmas do back-end): cada unidade entregue é uma linha em `entrega`; o estoque é **mensal** (soma de `historico_estoque.quantidade` no mês) e o saldo é esse total menos as entregas do mês; "família pendente" é a que não tem nenhuma entrega no mês corrente. Os painéis marcados "do mês" ignoram o seletor de tempo; os demais respeitam o período (padrão: últimos 6 meses). As consultas assumem o nome das tabelas/colunas gerado pelo Hibernate (`snake_case`, ex.: `historico_estoque.data_estoque`). Se o seu banco usar nomes diferentes, ajuste o JSON.

### Opção recomendada: Grafana atrás do Nginx do front (`/grafana/`)

Com `GRAFANA_URL` definido, o `entrypoint.sh` gera o proxy `/grafana/` no Nginx. Assim o `iframe` fica na mesma origem do sistema (sem problemas de cookie `SameSite`/CORS) e **o Grafana só responde para quem está logado**: antes de cada requisição o Nginx consulta `GET /api/funcionarios/me` no back com o cookie do usuário e devolve `401` se a sessão não for válida.

```bash
docker run -p 80:80 \
  -e BACKEND_URL=http://back:8080 \
  -e GRAFANA_URL=http://grafana:3000 \
  -e GRAFANA_DASHBOARD_URL=/grafana/d/abc123/familia-connect?orgId=1 \
  familia-connect-front
```

Se você usa o seu próprio Grafana em vez do que vem no `docker-compose.yml`, configure nele (variáveis de ambiente do container):

```env
GF_SERVER_ROOT_URL=https://SEU-FRONT/grafana/
GF_SERVER_SERVE_FROM_SUB_PATH=true
GF_SECURITY_ALLOW_EMBEDDING=true
GF_AUTH_ANONYMOUS_ENABLED=true
GF_AUTH_ANONYMOUS_ORG_ROLE=Viewer
```

> ⚠️ Com acesso anônimo ligado, **não exponha a porta do Grafana publicamente**: ele deve ser alcançável apenas pelo container do front (rede interna), que é quem aplica a checagem de login. O controle é por sessão válida; o nível de permissão `DASHBOARD` continua sendo aplicado só na interface (como no restante do front).
>
> ℹ️ O Nginx resolve o endereço do `GRAFANA_URL` ao iniciar: se o host não existir na rede, o container do front não sobe. Se não quiser usar o proxy, deixe `GRAFANA_URL` vazio.

### Alternativa: Grafana em outro domínio

Defina só `GRAFANA_DASHBOARD_URL` com a URL absoluta. O Grafana precisa permitir `iframe` (`GF_SECURITY_ALLOW_EMBEDDING=true`) e o usuário precisa conseguir abrir o painel sem tela de login dentro do `iframe` (acesso anônimo `Viewer`, ou HTTPS com `GF_SECURITY_COOKIE_SAMESITE=none` e `GF_SECURITY_COOKIE_SECURE=true`). Nesse modo o Grafana não passa pela checagem de login do sistema.

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

---

## 🤝 Contribuindo

1. Faça um fork do projeto
2. Crie uma branch para sua feature: `git checkout -b feature/minha-feature`
3. Commit suas alterações: `git commit -m 'feat: adiciona minha feature'`
4. Push para a branch: `git push origin feature/minha-feature`
5. Abra um Pull Request

---

## 🤖 CI/CD

O workflow em `.github/workflows/pipeline.yml` roda no GitHub Actions:

- **CI** — a cada `push` ou `pull request` para `main`: instala as dependências (Node.js 24), roda `npm run lint` e depois `npm run build` para validar que o projeto builda sem erros.
- **CD** — disparado manualmente (`workflow_dispatch`, com a versão da imagem como parâmetro), após o CI passar: builda a imagem Docker e publica no Docker Hub, taggeada com a versão informada e também como `latest`.

> Requer os secrets `DOCKERHUB_USERNAME` e `DOCKERHUB_TOKEN` configurados no ambiente `development` do repositório.
>
> Como a URL da API agora é resolvida em **runtime** (via `API_BASE_URL` + `entrypoint.sh`), a mesma imagem publicada pelo CD serve para qualquer ambiente — basta variar `API_BASE_URL` no `docker run`/`docker-compose.yml` de cada ambiente, sem precisar rebuildar ou ajustar o workflow.

---

## 📄 Licença

Este projeto está sob a licença MIT. Consulte o arquivo [LICENSE](LICENSE) para mais detalhes.