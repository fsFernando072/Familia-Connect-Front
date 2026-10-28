# AGENTS.md - Familia-Connect-Front

## Commands
- `npm run dev` — Start dev server (port 5173, HMR)
- `npm run build` — Production build to `/dist`
- `npm run preview` — Serve production build locally
- `npm run lint` — Run ESLint (flat config)

## Architecture
- **Stack**: React 19 + Vite 8 + Tailwind CSS 4 + React Router 7
- **Entry**: `src/main.jsx` → `src/App.jsx` → `src/routes.jsx`
- **Pages**: `src/pages/` (not `src/Pages/` as README states)
- **Services**: `src/services/` — Axios clients for backend (port 8080) and OCR (port 8000)
- **Components**: `src/components/` — Reusable UI components
- **API Base URL**: `http://localhost:8080` (defined in `src/services/apiClient.js`)

## Key Files
- `vite.config.js` — Vite + React + Tailwind plugins only
- `eslint.config.js` — Flat config: JS recommended + React Hooks + React Refresh
- `src/services/apiClient.js` — Axios instance with `withCredentials: true`, `validateStatus: () => true`

## Dependencies
- Backend (Spring Boot) must run on port 8080
- OCR service (FastAPI) must run on port 8000
- Node.js 18+ required

## Notes
- No test framework configured
- Path aliases not configured (use relative imports)
- `dist/` is gitignored and ESLint-ignored

## Dashboard (Grafana)
- `src/pages/Dashboard/index.jsx` embute o Grafana via iframe; URL em `src/services/grafanaService.js` (`window.__ENV__.GRAFANA_DASHBOARD_URL` → `VITE_GRAFANA_DASHBOARD_URL`)
- `GRAFANA_URL` (container) faz o `entrypoint.sh` gerar o proxy `/grafana/` no Nginx, protegido por `auth_request` em `/api/funcionarios/me`
- Detalhes e variáveis do Grafana: seção "Dashboard (Grafana)" do README
- `grafana/` traz o dashboard provisionado (`dashboards/familia-connect.json`), o datasource MySQL e o SQL do usuário somente-leitura; o `docker-compose.yml` sobe o Grafana junto com o front
