import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Users, Upload } from "lucide-react";
import PaginaLista from "../../components/PaginaLista/PaginaLista";
import ListaAcoes from "../../components/ListaAcoes/ListaAcoes";
import ListaStatus from "../../components/ListaStatus/ListaStatus";
import ListaItem from "../../components/ListaItem/ListaItem";
import ListaContainer from "../../components/ListaContainer/ListaContainer";
import ImagemLista from "../../components/ImagemLista/ImagemLista";
import LinhaInfo from "../../components/LinhaInfo/LinhaInfo";
import Botao from "../../components/Botao/Botao";
import BotaoSecundario from "../../components/BotaoSecundario/BotaoSecundario";
import Paginacao from "../../components/Paginacao/Paginacao";
import ModalConfirmacao from "../../components/ModalConfirmacao/ModalConfirmacao";
import ModalImportarFoto from "../../components/ModalImportarFoto/ModalImportarFoto";
import FotoAvatar from "../../components/FotoAvatar/FotoAvatar";
import { useListaPaginada } from "../../hooks/useListaPaginada";
import { listarFamilias, deletarFamilia } from "../../services/familiaService";
import { extrairDadosFamiliaPorFoto } from "../../services/ocrService";
import { COR_PERIGO, COR_PETROLEO, COR_TURQUESA } from "../../utils/cores";

function ListaFamilias() {
    const navigate = useNavigate();

    const [modalImportarAberto, setModalImportarAberto] = useState(false);
    const [importando, setImportando] = useState(false);
    const [erroImportacao, setErroImportacao] = useState("");

    const {
        itens, carregando,
        busca, setBusca, alternarOrdem,
        paginaAtual, setPaginaAtual, totalPaginas,
        feedback, fecharFeedback,
        itemParaApagar, pedirConfirmacao, cancelarApagar, confirmarApagar, apagando,
    } = useListaPaginada({
        listar: listarFamilias,
        apagar: deletarFamilia,
        chaveBusca: "nomeResponsavel",
        obterId: (familia) => familia.idFamilia,
        mensagens: {
            apagando: "Apagando família...",
            sucesso: "Família apagada com sucesso!",
            erro: "Não foi possível apagar a família.",
        },
    });

    const handleAbrirImportar = () => {
        setErroImportacao("");
        setModalImportarAberto(true);
    };

    const handleFecharImportar = () => {
        if (importando) return;
        setModalImportarAberto(false);
        setErroImportacao("");
    };

    const handleSelecionarArquivoImportacao = async (arquivo) => {
        setErroImportacao("");
        setImportando(true);

        const resultado = await extrairDadosFamiliaPorFoto(arquivo);

        setImportando(false);

        if (resultado.sucesso) {
            setModalImportarAberto(false);
            navigate("/familias/cadastro-familia", { state: { dadosOcr: resultado.dados } });
        } else {
            setErroImportacao(resultado.erro);
        }
    };

    return (
        <PaginaLista nomeTela="Lista de Famílias" feedback={feedback} onFecharFeedback={fecharFeedback}>
            <ListaAcoes
                busca={busca}
                onBuscaChange={(e) => setBusca(e.target.value)}
                placeholderBusca="Buscar Família"
                onOrdenar={alternarOrdem}
                onCadastrar={() => navigate("/familias/cadastro-familia")}
            >
                <BotaoSecundario nome="Importar Arquivo" icone={Upload} acao={handleAbrirImportar} />
            </ListaAcoes>

            <ListaStatus
                carregando={carregando}
                vazio={itens.length === 0}
                mensagemCarregando="Carregando famílias..."
                mensagemVazia="Nenhuma família encontrada."
            />

            <ListaContainer>
                {itens.map((familia) => (
                    <ListaItem
                        key={familia.idFamilia}
                        imagem={(
                            <ImagemLista>
                                <FotoAvatar
                                    caminho={familia.fotoFamilia}
                                    alt={`Foto da família ${familia.nomeFamilia}`}
                                    Icone={Users}
                                />
                            </ImagemLista>
                        )}
                        acoes={(
                            <>
                                <Botao nome="Ver Detalhes" cor={COR_PETROLEO} acao={() => navigate(`/familias/${familia.idFamilia}`)} />
                                <Botao nome="Editar" cor={COR_TURQUESA} acao={() => navigate(`/familias/${familia.idFamilia}/editar-familia`)} />
                                <Botao nome="Apagar" cor={COR_PERIGO} acao={() => pedirConfirmacao(familia)} />
                            </>
                        )}
                    >
                        <LinhaInfo rotulo="Família" valor={familia.nomeFamilia} />
                        <LinhaInfo rotulo="Nome do Responsável" valor={familia.nomeResponsavel} />
                        <LinhaInfo rotulo="Telefone do Responsável" valor={familia.telefoneResponsavel} />
                    </ListaItem>
                ))}
            </ListaContainer>

            <Paginacao paginaAtual={paginaAtual} totalPaginas={totalPaginas} onMudarPagina={setPaginaAtual} />

            <ModalImportarFoto
                aberto={modalImportarAberto}
                carregando={importando}
                erro={erroImportacao}
                onFechar={handleFecharImportar}
                onSelecionarArquivo={handleSelecionarArquivoImportacao}
            />

            <ModalConfirmacao
                aberto={Boolean(itemParaApagar)}
                titulo="Apagar família"
                mensagem={itemParaApagar ? `Deseja realmente apagar a família de "${itemParaApagar.nomeResponsavel}"? Essa ação não pode ser desfeita.` : ""}
                textoConfirmar="Sim, apagar"
                textoCancelar="Não"
                corConfirmar={COR_PERIGO}
                carregando={apagando}
                onConfirmar={confirmarApagar}
                onCancelar={cancelarApagar}
            />
        </PaginaLista>
    );
}

export default ListaFamilias;
