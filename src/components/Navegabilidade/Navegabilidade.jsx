import { Fragment } from "react";
import { Link, useLocation } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import nomesRotas from "../../routes/nomesRotas";

// Segmentos que representam um identificador (ex: /familias/12) não devem
// aparecer "crus" na navegabilidade.
const ehIdentificador = (segmento) => /^\d+$/.test(segmento);

const CLASSE_LINK = "transition-colors hover:text-cifa-turquesa";

function Navegabilidade({ sufixoUltimo }) {
    const location = useLocation();

    const caminhos = location.pathname
        .split("/")
        .filter(Boolean);

    return (
        <nav
            aria-label="Você está em"
            className="flex items-center gap-1.5 overflow-x-auto whitespace-nowrap text-sm font-medium text-cifa-apagado"
        >
            <Link to="/pagina-inicial" className={CLASSE_LINK}>Página Inicial</Link>

            {caminhos.map((caminho, index) => {
                const rota = "/" + caminhos.slice(0, index + 1).join("/");
                const ehUltimo = index === caminhos.length - 1;

                // Segmento intermediário (ex: entre "familias" e "editar-familia"):
                // não exibe nada, só faz parte do caminho.
                if (ehIdentificador(caminho) && !ehUltimo) return null;

                // Último segmento sendo um id (ex: /familias/12): é a tela de detalhes.
                const texto = ehIdentificador(caminho)
                    ? "Detalhes da Família"
                    : `${nomesRotas[caminho] || caminho}${ehUltimo && sufixoUltimo ? ` ${sufixoUltimo}` : ""}`;

                return (
                    <Fragment key={rota}>
                        <ChevronRight size={14} className="shrink-0" aria-hidden="true" />
                        {ehUltimo ? (
                            <span aria-current="page" className="font-semibold text-cifa-navy">{texto}</span>
                        ) : (
                            <Link to={rota} className={CLASSE_LINK}>{texto}</Link>
                        )}
                    </Fragment>
                );
            })}
        </nav>
    );
}

export default Navegabilidade;
