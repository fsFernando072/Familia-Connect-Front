import { Link, useLocation } from "react-router-dom";
import nomesRotas from "../../routes/nomesRotas";

// Segmentos que representam um identificador (ex: /familias/12) não devem
// aparecer "crus" na navegabilidade.
const ehIdentificador = (segmento) => /^\d+$/.test(segmento);

function Navegabilidade() {
    const location = useLocation();

    const caminhos = location.pathname
        .split("/")
        .filter(Boolean);

    return (
        <div className="px-6 py-4 text-[#1E66F5] font-medium">
            <Link to="/pagina-inicial" className="underline hover:text-blue-800">Página Inicial</Link>

            {caminhos.map((caminho, index) => {
                const rota = "/" + caminhos.slice(0, index + 1).join("/");
                const ehUltimo = index === caminhos.length - 1;

                if (ehIdentificador(caminho)) {
                    // Segmento intermediário (ex: entre "familias" e "editar-familia"):
                    // não exibe nada, só faz parte do caminho.
                    if (!ehUltimo) return null;

                    // Último segmento sendo um id (ex: /familias/12): é a tela de detalhes.
                    return (
                        <span key={rota}>
                            {" > "}
                            <Link to={rota} className="underline hover:text-blue-800">
                                Detalhes Família
                            </Link>
                        </span>
                    );
                }

                return (
                    <span key={rota}>
                        {" > "}
                        <Link to={rota} className="underline hover:text-blue-800">
                            {nomesRotas[caminho] || caminho}
                        </Link>
                    </span>
                );
            })}
        </div>
    );
}

export default Navegabilidade;