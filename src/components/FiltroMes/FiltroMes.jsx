import { CalendarDays } from "lucide-react";

const MESES = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];

const CLASSE_SELECT =
    "px-3.5 py-2.5 border border-cifa-linha rounded-xl text-base bg-white text-cifa-navy cursor-pointer transition " +
    "focus:outline-none focus:border-cifa-menta focus:ring-4 focus:ring-cifa-menta/20 disabled:opacity-50 disabled:cursor-not-allowed";

const ANOS_PARA_TRAS = 5;
const ANOS_PARA_FRENTE = 1;

/**
 * Filtro de mês com dois selects (mês + ano), que funciona em qualquer navegador.
 * valor:         "aaaa-mm" ou "" (todos os meses, só quando permitirTodos)
 * onChange:      recebe o novo valor no mesmo formato
 */
function FiltroMes({ valor, onChange, permitirTodos = false }) {
    const anoAtual = new Date().getFullYear();
    const numeroMes = valor ? valor.slice(5, 7) : "";
    const ano = valor ? valor.slice(0, 4) : String(anoAtual);
    const anos = Array.from({ length: ANOS_PARA_TRAS + ANOS_PARA_FRENTE + 1 }, (_, i) => anoAtual - ANOS_PARA_TRAS + i);

    const handleMes = (e) => {
        const novoMes = e.target.value;
        onChange(novoMes ? `${ano}-${novoMes}` : "");
    };

    const handleAno = (e) => onChange(`${e.target.value}-${numeroMes}`);

    return (
        <div className="flex items-center gap-2">
            <CalendarDays size={18} className="text-cifa-apagado shrink-0" aria-hidden="true" />
            <select value={numeroMes} onChange={handleMes} aria-label="Mês" className={CLASSE_SELECT}>
                {permitirTodos && <option value="">Todos os meses</option>}
                {MESES.map((nome, indice) => (
                    <option key={nome} value={String(indice + 1).padStart(2, "0")}>
                        {nome}
                    </option>
                ))}
            </select>
            <select value={ano} onChange={handleAno} disabled={!numeroMes} aria-label="Ano" className={CLASSE_SELECT}>
                {anos.map((a) => (
                    <option key={a} value={String(a)}>
                        {a}
                    </option>
                ))}
            </select>
        </div>
    );
}

export default FiltroMes;
