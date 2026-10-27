import { CheckCircle2, XCircle, Loader2, X } from "lucide-react";

const ESTILOS = {
    processando: { bg: "#d9eaeb", borda: "#137d91", texto: "#08425d" },
    sucesso: { bg: "#dcfce7", borda: "#16a34a", texto: "#15803d" },
    erro: { bg: "#fee2e2", borda: "#dc2626", texto: "#b91c1c" },
};

function Icone({ tipo }) {
    if (tipo === "processando") return <Loader2 size={18} className="animate-spin shrink-0" />;
    if (tipo === "sucesso") return <CheckCircle2 size={18} className="shrink-0" />;
    return <XCircle size={18} className="shrink-0" />;
}

// Notificações no canto superior direito sobre o processamento das carteirinhas.
function NotificacoesCarteirinha({ notificacoes, onFechar }) {
    if (notificacoes.length === 0) return null;

    return (
        <div className="fixed top-6 right-6 z-50 flex w-[calc(100%-3rem)] max-w-sm flex-col gap-3">
            {notificacoes.map(({ id, tipo, msg, saindo }) => {
                const { bg, borda, texto } = ESTILOS[tipo];

                return (
                    <div
                        key={id}
                        role="status"
                        style={{ backgroundColor: bg, border: `1px solid ${borda}`, color: texto }}
                        className={`flex items-center gap-3 rounded-xl px-5 py-3.5 text-sm font-medium shadow-lg transition-all duration-300 ${saindo ? "translate-x-4 opacity-0" : "translate-x-0 opacity-100"}`}
                    >
                        <Icone tipo={tipo} />
                        <span className="flex-1">{msg}</span>
                        {tipo !== "processando" && (
                            <button type="button" onClick={() => onFechar(id)} aria-label="Fechar" className="shrink-0 cursor-pointer opacity-60 hover:opacity-100">
                                <X size={16} />
                            </button>
                        )}
                    </div>
                );
            })}
        </div>
    );
}

export default NotificacoesCarteirinha;
