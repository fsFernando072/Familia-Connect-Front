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