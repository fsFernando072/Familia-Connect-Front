// Configuração do painel do Grafana que aparece na tela Dashboard.
//
// Ordem de prioridade (a mesma do apiClient):
// 1. window.__ENV__.GRAFANA_DASHBOARD_URL -> injetado em runtime pelo entrypoint.sh do container (Docker/nginx)
// 2. import.meta.env.VITE_GRAFANA_DASHBOARD_URL -> variável do Vite, útil em dev (npm run dev) e build local
//
// O valor é o link do dashboard no Grafana (aquele de "Share" > "Link"), por exemplo:
//   /grafana/d/abc123/familia-connect?orgId=1          (Grafana atrás do nginx do front, mesma origem)
//   https://grafana.seudominio.com/d/abc123/familia-connect?orgId=1
export const GRAFANA_DASHBOARD_URL = window.__ENV__?.GRAFANA_DASHBOARD_URL || import.meta.env.VITE_GRAFANA_DASHBOARD_URL || "";

// Períodos do seletor da tela. `valor` vai no parâmetro `from` do Grafana ("to" é sempre "now").
// "" = não mexe no período: vale o que estiver salvo no próprio dashboard.
export const PERIODOS_DASHBOARD = [
    { valor: "", rotulo: "Padrão do painel" },
    { valor: "now-7d", rotulo: "Últimos 7 dias" },
    { valor: "now-30d", rotulo: "Últimos 30 dias" },
    { valor: "now-90d", rotulo: "Últimos 90 dias" },
    { valor: "now-6M", rotulo: "Últimos 6 meses" },
    { valor: "now-1y", rotulo: "Último ano" },
];

/**
 * Monta a URL do dashboard a partir da configuração.
 *
 * - periodo: um `valor` de PERIODOS_DASHBOARD ("" mantém o período do dashboard)
 * - embutido: true  -> versão para o iframe (modo kiosk: sem menu/barra do Grafana, tema claro como o resto do sistema)
 *             false -> link completo, para abrir o Grafana em outra aba
 *
 * Devolve null se a URL não estiver configurada ou for inválida (só aceita http/https).
 */
export function montarUrlDashboard(periodo = "", embutido = true) {
    if (!GRAFANA_DASHBOARD_URL) return null;

    try {
        const url = new URL(GRAFANA_DASHBOARD_URL, window.location.origin);

        if (url.protocol !== "http:" && url.protocol !== "https:") return null;

        if (periodo) {
            url.searchParams.set("from", periodo);
            url.searchParams.set("to", "now");
        }

        if (embutido) {
            url.searchParams.set("theme", "light");
            url.searchParams.set("kiosk", "");
        }

        return url.toString();
    } catch (error) {
        console.error("URL do Grafana inválida:", error);
        return null;
    }
}
