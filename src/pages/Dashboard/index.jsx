import { useState } from "react";
import { ExternalLink, LayoutDashboard, Loader2, RefreshCw, TriangleAlert } from "lucide-react";
import CabecalhoPagina from "../../components/CabecalhoPagina/CabecalhoPagina";
import CartaoSecao from "../../components/CartaoSecao/CartaoSecao";
import Botao from "../../components/Botao/Botao";
import BotaoSecundario from "../../components/BotaoSecundario/BotaoSecundario";
import { CLASSE_INPUT, CLASSE_LABEL } from "../../components/estilosCampo";
import { PERIODOS_DASHBOARD, montarUrlDashboard } from "../../services/grafanaService";
import { COR_TURQUESA } from "../../utils/cores";

// O Grafana precisa de scripts e da própria origem para funcionar; o sandbox só impede que o painel navegue a janela do sistema.
const PERMISSOES_IFRAME = "allow-scripts allow-same-origin allow-forms allow-popups allow-popups-to-escape-sandbox allow-downloads";

// Painel (dashboard) feito no Grafana, embutido na tela. Os dados e os gráficos vêm todos de lá:
// esta tela só cuida do enquadramento, do período e dos atalhos (atualizar / abrir no Grafana).
function Dashboard() {
    const [periodo, setPeriodo] = useState("");
    const [recarga, setRecarga] = useState(0); // trocar a key do iframe força o Grafana a recarregar
    const [carregado, setCarregado] = useState(false);

    const urlEmbutida = montarUrlDashboard(periodo, true);
    const urlCompleta = montarUrlDashboard(periodo, false);
    const configurado = Boolean(urlEmbutida);

    const handleMudarPeriodo = (e) => {
        setCarregado(false);
        setPeriodo(e.target.value);
    };

    const handleAtualizar = () => {
        setCarregado(false);
        setRecarga((valorAtual) => valorAtual + 1);
    };

    const handleAbrirNoGrafana = () => window.open(urlCompleta, "_blank", "noopener,noreferrer");

    return (
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-8 py-6 sm:py-8">
            <CabecalhoPagina nomeTela="Dashboard" />

            <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                <div className="sm:w-60">
                    <label htmlFor="periodo-dashboard" className={CLASSE_LABEL}>
                        Período
                    </label>
                    <select id="periodo-dashboard" value={periodo} onChange={handleMudarPeriodo} disabled={!configurado} className={`${CLASSE_INPUT} cursor-pointer`}>
                        {PERIODOS_DASHBOARD.map(({ valor, rotulo }) => (
                            <option key={valor} value={valor}>
                                {rotulo}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="flex flex-wrap gap-3">
                    <BotaoSecundario nome="Atualizar" icone={RefreshCw} acao={handleAtualizar} desabilitado={!configurado} />
                    <Botao nome="Abrir no Grafana" icone={ExternalLink} cor={COR_TURQUESA} acao={handleAbrirNoGrafana} desabilitado={!configurado} />
                </div>
            </div>

            <CartaoSecao titulo="Indicadores" Icone={LayoutDashboard}>
                {configurado ? (
                    <div className="relative">
                        <iframe
                            key={recarga}
                            src={urlEmbutida}
                            title="Dashboard de indicadores (Grafana)"
                            sandbox={PERMISSOES_IFRAME}
                            onLoad={() => setCarregado(true)}
                            className="block h-[80vh] min-h-[560px] w-full rounded-xl border border-cifa-linha bg-white"
                        />

                        {!carregado && (
                            <div className="absolute inset-0 flex items-center justify-center gap-3 rounded-xl bg-white/90 text-cifa-apagado" role="status">
                                <Loader2 size={22} className="animate-spin text-cifa-turquesa" />
                                <span>Carregando dashboard...</span>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="flex flex-col items-center gap-3 px-4 py-16 text-center" role="alert">
                        <span className="flex h-14 w-14 items-center justify-center rounded-xl bg-cifa-suave text-cifa-petroleo">
                            <TriangleAlert size={26} />
                        </span>
                        <p className="text-xl font-extrabold tracking-tight text-cifa-navy">Dashboard indisponível</p>
                        <p className="max-w-md text-cifa-apagado">
                            O painel do Grafana ainda não foi configurado neste ambiente. Peça para a equipe técnica informar a variável <code className="rounded bg-cifa-suave px-1.5 py-0.5 text-sm text-cifa-petroleo">GRAFANA_DASHBOARD_URL</code>.
                        </p>
                    </div>
                )}
            </CartaoSecao>

            {configurado && <p className="mt-4 text-sm text-cifa-apagado">O painel não apareceu ou pediu login? Use “Abrir no Grafana” para ver o dashboard em uma nova aba.</p>}
        </div>
    );
}

export default Dashboard;
