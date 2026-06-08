import { Link, useLocation } from "react-router-dom";
import nomesRotas from "../../routes/nomesRotas";

function Navegabilidade() {
    const location = useLocation();

    const caminhos = location.pathname
        .split("/")
        .filter(Boolean);

    return (
        <div className="px-6 py-4 text-[#1E66F5] font-medium">
            <Link to="/" className="underline hover:text-blue-800">Página Inicial</Link>

            {caminhos.map((caminho, index) => {
                const rota = "/" + caminhos.slice(0, index + 1).join("/");

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