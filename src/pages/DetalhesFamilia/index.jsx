import { useEffect, useState } from "react";
import { useNavigate, useParams, useOutletContext } from "react-router-dom";
import { User, MapPin, Users, Pencil, IdCard, FileText, TriangleAlert } from "lucide-react";
import AbasDetalhes from "../../components/AbasDetalhes/AbasDetalhes";
import CarteirinhaFamilia from "../../components/CarteirinhaFamilia/CarteirinhaFamilia";
import StatusCarteirinha from "../../components/StatusCarteirinha/StatusCarteirinha";
import { obterUltimoSobrenome } from "../../utils/nomes";
import PaginaFormulario from "../../components/PaginaFormulario/PaginaFormulario";
import Botao from "../../components/Botao/Botao";
import FotoAvatar from "../../components/FotoAvatar/FotoAvatar";
import ImagemLista from "../../components/ImagemLista/ImagemLista";
import CartaoSecao from "../../components/CartaoSecao/CartaoSecao";
import CampoDetalhe from "../../components/CampoDetalhe/CampoDetalhe";
import Selo from "../../components/Selo/Selo";
import ListaContainer from "../../components/ListaContainer/ListaContainer";
import ListaStatus from "../../components/ListaStatus/ListaStatus";
import { useFeedback } from "../../hooks/useFeedback";
import { buscarFamiliaPorId, solicitarCriacaoCarteirinha, verificarCarteirinhaFamilia } from "../../services/familiaService";
import { feedbackCarregando, feedbackErro } from "../../utils/feedback";
import { mascaraCpf, mascaraRg, mascaraTelefone, mascaraCep } from "../../utils/mascaras";
import { converterDataParaBr } from "../../utils/formatadores";
import { COR_TURQUESA } from "../../utils/cores";
import { pode } from "../../services/permissoes";

const ABAS = [
    { id: "dados", titulo: "Dados da Família", Icone: FileText },
    { id: "carteirinha", titulo: "Carteirinha", Icone: IdCard },
];

function DetalhesFamilia() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { permissoes, acompanharCarteirinha, conclusaoCarteirinha } = useOutletContext();
    const { feedback, setFeedback, fecharFeedback } = useFeedback();

    const [familia, setFamilia] = useState(null);
    const [carregando, setCarregando] = useState(true);
    const [abaAtiva, setAbaAtiva] = useState("dados");
    const [possuiCarteirinha, setPossuiCarteirinha] = useState(false);
    const [verificandoCarteirinha, setVerificandoCarteirinha] = useState(true);
    const [inicioCriacao, setInicioCriacao] = useState(null);

    useEffect(() => {
        async function carregarFamilia() {
            setCarregando(true);
            const dados = await buscarFamiliaPorId(id);
            setFamilia(dados);
            setCarregando(false);
        }
        carregarFamilia();
    }, [id]);

    useEffect(() => {
        let cancelado = false;

        async function verificar() {
            setVerificandoCarteirinha(true);
            const { possui, erro } = await verificarCarteirinhaFamilia(id);
            if (cancelado) return;

            setPossuiCarteirinha(possui);
            if (erro) setFeedback(feedbackErro("Não foi possível verificar a carteirinha da família."));
            setVerificandoCarteirinha(false);
        }
        verificar();

        return () => {
            cancelado = true;
        };
    }, [id, setFeedback]);

    // O acompanhamento roda no layout; aqui só se compara a conclusão com o momento em que o pedido foi feito.
    const concluiuDepoisDoPedido = Boolean(inicioCriacao && conclusaoCarteirinha && conclusaoCarteirinha.em >= inicioCriacao);
    const criandoCarteirinha = Boolean(inicioCriacao) && !concluiuDepoisDoPedido;
    const temCarteirinha = possuiCarteirinha || (concluiuDepoisDoPedido && conclusaoCarteirinha.tipo === "sucesso");

    async function criarCarteirinha() {
        setInicioCriacao(Date.now());
        setFeedback(feedbackCarregando("Solicitando criação da carteirinha..."));

        const correlationId = await solicitarCriacaoCarteirinha(id);
        if (!correlationId) {
            setFeedback(feedbackErro("Não foi possível solicitar a criação da carteirinha."));
            setInicioCriacao(null);
            return;
        }

        fecharFeedback();
        acompanharCarteirinha(correlationId);
    }

    const responsavel = familia?.responsavel;
    const endereco = familia?.endereco;
    const dependentes = familia?.dependentes || [];

    const logradouroCompleto = endereco?.logradouro ? `${endereco.logradouro}${endereco.numero ? `, ${endereco.numero}` : ""}` : "-";

    return (
        <PaginaFormulario
            nomeTela="Detalhes da Família"
            acao={pode(permissoes, "FAMILIAS", "editar") ? <Botao nome="Editar Cadastro" icone={Pencil} cor={COR_TURQUESA} acao={() => navigate(`/familias/${id}/editar-familia`)} /> : undefined}
            comCartao={false}
            carregando={carregando}
            carregandoTexto="Carregando família..."
            encontrado={Boolean(familia)}
            naoEncontradoTexto="Família não encontrada."
            feedback={feedback}
            onFecharFeedback={fecharFeedback}
        >
            <ListaContainer gap="gap-6">
                <AbasDetalhes abas={ABAS} abaAtiva={abaAtiva} aoMudar={setAbaAtiva} />

                {abaAtiva === "carteirinha" && (
                    <>
                        <CartaoSecao titulo="Situação da Carteirinha" Icone={IdCard}>
                            <StatusCarteirinha possuiCarteirinha={temCarteirinha} carregando={verificandoCarteirinha} criando={criandoCarteirinha} aoCriar={criarCarteirinha} />
                        </CartaoSecao>

                        <CartaoSecao titulo="Modelo Visual da Carteirinha" Icone={IdCard}                         extra={<span className="inline-flex items-center px-4 py-1.5 rounded-full bg-amber-400 text-amber-950 text-sm font-black tracking-wide uppercase shadow-sm animate-pulse">Apenas modelo</span>}>
                                                    <div className="mb-4 flex items-center gap-3 rounded-xl border-2 border-amber-400 bg-amber-50 px-4 py-3 text-amber-900">
                                                        <TriangleAlert size={22} className="shrink-0" />
                                                        <p className="text-base font-bold">ATENÇÃO: este é apenas um modelo visual da carteirinha. Não é a carteirinha emitida.</p>
                                                    </div>
                            <CarteirinhaFamilia
                                nomeFamilia={obterUltimoSobrenome(responsavel?.nome)}
                                nomeResponsavel={responsavel?.nome}
                                cpf={responsavel?.cpf ? mascaraCpf(responsavel.cpf) : ""}
                                telefone={responsavel?.telefone ? mascaraTelefone(responsavel.telefone) : ""}
                                quantidadeMembros={1 + dependentes.length}
                            />
                        </CartaoSecao>
                    </>
                )}

                {abaAtiva === "dados" && (
                <>
                <CartaoSecao titulo="Dados do Responsável" Icone={User} extra={<Selo texto="Cadastro Ativo" />}>
                    <div className="flex flex-col sm:flex-row items-start gap-6">
                        <ImagemLista tamanho="w-28 h-28">
                            <FotoAvatar caminho={familia?.fotoFamilia} alt={`Foto da família ${familia?.nomeFamilia}`} Icone={Users} tamanhoIcone={36} />
                        </ImagemLista>

                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-x-6 gap-y-4 flex-1 min-w-0 w-full">
                            <CampoDetalhe rotulo="Nome Completo" valor={responsavel?.nome} />
                            <CampoDetalhe rotulo="CPF" valor={responsavel?.cpf ? mascaraCpf(responsavel.cpf) : "-"} />
                            <CampoDetalhe rotulo="RG" valor={responsavel?.rg ? mascaraRg(responsavel.rg) : "-"} />
                            <CampoDetalhe rotulo="Telefone" valor={responsavel?.telefone ? mascaraTelefone(responsavel.telefone) : "-"} />
                            <CampoDetalhe rotulo="Data de Nascimento" valor={converterDataParaBr(responsavel?.dataNascimento)} />
                            <CampoDetalhe rotulo="Profissão" valor={responsavel?.profissao} />
                            <CampoDetalhe rotulo="PNE" valor={familia?.possuiPrioridade ? "Sim" : "Não"} />
                            <CampoDetalhe rotulo="Sexo" valor={responsavel?.sexo} />
                        </div>
                    </div>
                </CartaoSecao>

                <CartaoSecao titulo="Dados do Endereço" Icone={MapPin}>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-6 gap-y-4">
                        <CampoDetalhe rotulo="Logradouro" valor={logradouroCompleto} />
                        <CampoDetalhe rotulo="Bairro" valor={endereco?.bairro} />
                        <CampoDetalhe rotulo="CEP" valor={endereco?.cep ? mascaraCep(endereco.cep) : "-"} />
                        <CampoDetalhe rotulo="Cidade" valor={endereco?.cidade} />
                        <CampoDetalhe rotulo="Estado" valor={endereco?.enderecoEstado?.sigla} />
                    </div>
                </CartaoSecao>

                <CartaoSecao
                    titulo="Dependentes"
                    Icone={Users}
                    extra={
                        <span className="text-sm font-bold text-cifa-turquesa">
                            {dependentes.length} cadastrado{dependentes.length !== 1 ? "s" : ""}
                        </span>
                    }
                >
                    <ListaStatus carregando={false} vazio={dependentes.length === 0} mensagemVazia="Nenhum dependente cadastrado." />

                    {dependentes.length > 0 && (
                        <div className="rounded-xl border border-cifa-linha overflow-hidden">
                            <div className="hidden sm:grid sm:grid-cols-4 gap-4 px-4 py-3 bg-cifa-fundo/60 text-xs font-bold tracking-wide text-cifa-apagado uppercase">
                                <span>Nome Completo</span>
                                <span>Parentesco</span>
                                <span>Nascimento</span>
                                <span>Sexo</span>
                            </div>

                            <div className="divide-y divide-cifa-linha">
                                {dependentes.map((dep) => (
                                    <div key={dep.id} className="grid grid-cols-2 sm:grid-cols-4 gap-x-4 gap-y-3 px-4 py-3">
                                        <CampoDetalhe rotulo="Nome Completo" valor={dep.nome} ocultarRotuloEmTelasGrandes />
                                        <CampoDetalhe rotulo="Parentesco" valor={dep.grauParentesco} ocultarRotuloEmTelasGrandes />
                                        <CampoDetalhe rotulo="Nascimento" valor={converterDataParaBr(dep.dataNascimento)} ocultarRotuloEmTelasGrandes />
                                        <CampoDetalhe rotulo="Sexo" valor={dep.sexo} ocultarRotuloEmTelasGrandes />
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </CartaoSecao>
                </>
                )}
            </ListaContainer>
        </PaginaFormulario>
    );
}

export default DetalhesFamilia;
