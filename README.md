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
├── public/                  # Arquivos públicos estáticos
│
├── src/
│   ├── assets/              # Imagens, ícones e fontes
│   ├── components/          # Componentes reutilizáveis (botões, inputs, tabelas...)
│   ├── pages/               # Páginas da aplicação (uma por rota)
│   ├── routes/              # Configuração das rotas (React Router)
│   ├── services/            # Chamadas à API (fetch/axios)
│   ├── App.jsx              # Componente raiz
│   └── main.jsx             # Ponto de entrada da aplicação
│
├── index.html               # HTML base
├── vite.config.js           # Configuração do Vite
├── eslint.config.js         # Configuração do ESLint
├── package.json
└── .gitignore
```

---

## ⚙️ Pré-requisitos

- [Node.js 18+](https://nodejs.org/)
- [npm](https://www.npmjs.com/) ou [yarn](https://yarnpkg.com/)
- Backend do Família Connect rodando localmente ou em nuvem

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

## 📄 Licença

Este projeto está sob a licença MIT. Consulte o arquivo [LICENSE](LICENSE) para mais detalhes.