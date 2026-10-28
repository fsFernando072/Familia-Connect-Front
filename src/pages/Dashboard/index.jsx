import { useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import api from "../../services/apiClient";
import { pode } from "../../services/permissoes";
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
    const navigate = useNavigate();
    const { permissoes } = useOutletContext();
    const [visao, setVisao] = useState("macro");
    const [buscaFamilia, setBuscaFamilia] = useState("");
    const [familias, setFamilias] = useState([]);
    const [familiaId, setFamiliaId] = useState("");
    const [erroBusca, setErroBusca] = useState("");
    const [buscando, setBuscando] = useState(false);
    const [periodo, setPeriodo] = useState("");
    const [recarga, setRecarga] = useState(0); // trocar a key do iframe força o Grafana a recarregar
    const [carregado, setCarregado] = useState(false);

    const urlEmbutida = montarUrlDashboard(periodo, true, visao, familiaId);
    const urlCompleta = montarUrlDashboard(periodo, false, visao, familiaId);
    const configurado = Boolean(urlEmbutida);

    const buscarFamilias = async () => {
        setBuscando(true);
        setErroBusca("");
        try {
            const { data } = await api.get("/familias", { params: { nomeResponsavel: buscaFamilia, size: 30 } });
            setFamilias(data?.content || []);
            if (!data?.content?.length) setErroBusca("Nenhuma família encontrada.");
        } catch {
            setErroBusca("Não foi possível buscar famílias. Verifique sua permissão de consulta.");
        } finally {
            setBuscando(false);
        }
    };

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

            <div className="mb-5 flex gap-2 border-b border-cifa-linha pb-3" role="tablist" aria-label="Visões da dashboard">
                {[{ id: "macro", titulo: "Visão Macro" }, { id: "micro", titulo: "Visão Micro" }].map(({ id, titulo }) => (
                    <button key={id} type="button" role="tab" aria-selected={visao === id}
                        onClick={() => { setVisao(id); setCarregado(false); }}
                        className={`rounded-lg px-5 py-3 font-bold transition ${visao === id ? "bg-cifa-petroleo text-white" : "bg-cifa-suave text-cifa-navy hover:brightness-95"}`}>
                        {titulo}
                    </button>
                ))}
            </div>
            <p className="mb-5 text-sm text-cifa-apagado">{visao === "macro" ? "Panorama geral do atendimento, cobertura e distribuição de recursos do CIFA." : "Acompanhe prioridades e atendimentos; selecione uma família para consultar seu histórico."}</p>
            {visao === "micro" && (
                <div className="mb-5 rounded-xl border border-cifa-linha p-4">
                    <label htmlFor="busca-familia-dashboard" className={CLASSE_LABEL}>Buscar família pelo nome do responsável</label>
                    <div className="mt-2 flex flex-wrap gap-2">
                        <input id="busca-familia-dashboard" className={`${CLASSE_INPUT} flex-1`} value={buscaFamilia} onChange={e => setBuscaFamilia(e.target.value)} onKeyDown={e => { if (e.key === "Enter") buscarFamilias(); }} placeholder="Nome do responsável" />
                        <button type="button" onClick={buscarFamilias} disabled={buscando} className="rounded-lg bg-cifa-petroleo px-4 py-2 font-bold text-white">{buscando ? "Buscando..." : "Buscar"}</button>
                    </div>
                    {erroBusca && <p role="status" className="mt-2 text-sm text-cifa-apagado">{erroBusca}</p>}
                    {familias.length > 0 && <div className="mt-3"><label htmlFor="familia-dashboard" className={CLASSE_LABEL}>Família</label>
                        <select id="familia-dashboard" className={CLASSE_INPUT} value={familiaId} onChange={e => {setFamiliaId(e.target.value);setCarregado(false);}}>
                            <option value="">Todas as famílias — visão operacional geral</option>
                            {familias.map(f => <option key={f.idFamilia} value={f.idFamilia}>{f.nomeResponsavel || `Família ${f.idFamilia}`} (#{f.idFamilia})</option>)}
                        </select></div>}
                    {familiaId && <button type="button" onClick={() => { setFamiliaId(""); setCarregado(false); }} className="mt-3 mr-4 text-sm font-bold text-cifa-petroleo underline">Voltar à visão geral</button>}
                    {familiaId && pode(permissoes, "FAMILIAS", "listar") && <button type="button" onClick={() => navigate(`/familias/${familiaId}`)} className="mt-3 text-sm font-bold text-cifa-petroleo underline">Abrir cadastro da família selecionada</button>}
                </div>
            )}
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

            <CartaoSecao titulo={visao === "macro" ? "Indicadores gerais" : familiaId ? "Acompanhamento individual" : "Acompanhamento operacional"} Icone={LayoutDashboard}>
                {configurado ? (
                    <div className="relative">
                        <iframe
                            key={`${visao}-${familiaId}-${periodo}-${recarga}`}
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
