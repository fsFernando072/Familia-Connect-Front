// Config de runtime. Em produção (Docker), este arquivo é REESCRITO pelo
// entrypoint.sh no start do container, com base nas variáveis de ambiente
// do container — não em build time.
//
// Em desenvolvimento local (npm run dev / npm run build sem Docker), este
// arquivo padrão é servido como está e o apiClient cai no fallback do
// import.meta.env.VITE_API_BASE_URL (ou no default hardcoded).
window.__ENV__ = {
  API_BASE_URL: "",
};
