import { useNavigate } from "react-router-dom";
import { UserRound } from "lucide-react";
import PaginaLista from "../../components/PaginaLista/PaginaLista";
import ListaAcoes from "../../components/ListaAcoes/ListaAcoes";
import ListaStatus from "../../components/ListaStatus/ListaStatus";
import ListaItem from "../../components/ListaItem/ListaItem";
import ListaContainer from "../../components/ListaContainer/ListaContainer";
import ImagemLista from "../../components/ImagemLista/ImagemLista";
import LinhaInfo from "../../components/LinhaInfo/LinhaInfo";
import Botao from "../../components/Botao/Botao";
import Paginacao from "../../components/Paginacao/Paginacao";
import ModalConfirmacao from "../../components/ModalConfirmacao/ModalConfirmacao";
import FotoAvatar from "../../components/FotoAvatar/FotoAvatar";
import { mascaraCpf } from "../../utils/mascaras";
import { listarFuncionarios, deletarFuncionario } from "../../services/funcionarioService";
import { useListaPaginada } from "../../hooks/useListaPaginada";

function ListaFuncionarios() {

    const navigate = useNavigate();
    const {
        itens, carregando,
        busca, setBusca, alternarOrdem,
        paginaAtual, setPaginaAtual, totalPaginas,
        feedback, fecharFeedback,
        itemParaApagar, pedirConfirmacao, cancelarApagar, confirmarApagar, apagando,
    } = useListaPaginada({
        listar: listarFuncionarios,
        apagar: deletarFuncionario,
        mensagens: {
            apagando: 'Apagando funcionário...',
            sucesso: 'Funcionário apagado com sucesso!',
            erro: 'Não foi possível apagar o funcionário.',
        },
    });

    return (
        <PaginaLista nomeTela='Lista de Funcionários' feedback={feedback} onFecharFeedback={fecharFeedback}>
            <ListaAcoes
                busca={busca}
                onBuscaChange={(e) => setBusca(e.target.value)}
                placeholderBusca='Buscar Funcionário'
                onOrdenar={alternarOrdem}
                onCadastrar={() => navigate('/funcionarios/cadastro-funcionario')}
            />

            <ListaStatus
                carregando={carregando}
                vazio={itens.length === 0}
                mensagemCarregando='Carregando funcionários...'
                mensagemVazia='Nenhum funcionário encontrado.'
            />

            <ListaContainer>
                {itens.map((funcionario) => (
                    <ListaItem
                        key={funcionario.id}
                        imagem={(
                            <ImagemLista>
                                <FotoAvatar
                                    caminho={funcionario.fotoFuncionario}
                                    alt={`Foto do funcionário ${funcionario.nome}`}
                                    Icone={UserRound}
                                />
                            </ImagemLista>
                        )}
                        acoes={(
                            <>
                                <Botao nome='Editar' cor='#137D91' acao={() => navigate(`/funcionarios/${funcionario.id}/editar-funcionario`)} />
                                <Botao nome='Apagar' cor='#DC2626' acao={() => pedirConfirmacao(funcionario)} />
                            </>
                        )}
                    >
                        <LinhaInfo rotulo='Nome' valor={funcionario.nome} />
                        <LinhaInfo rotulo='CPF' valor={funcionario.cpf ? mascaraCpf(funcionario.cpf) : '-'} />
                        <LinhaInfo rotulo='Cargo' valor={funcionario.cargo?.nome || '-'} />
                    </ListaItem>
                ))}
            </ListaContainer>

            <Paginacao paginaAtual={paginaAtual} totalPaginas={totalPaginas} onMudarPagina={setPaginaAtual} />

            <ModalConfirmacao
                aberto={!!itemParaApagar}
                titulo="Apagar funcionário"
                mensagem={itemParaApagar ? `Deseja realmente apagar o funcionário ${itemParaApagar.nome}? Essa ação não pode ser desfeita.` : ''}
                textoConfirmar="Sim, apagar"
                textoCancelar="Não"
                corConfirmar="#DC2626"
                carregando={apagando}
                onConfirmar={confirmarApagar}
                onCancelar={cancelarApagar}
            />
        </PaginaLista>
    );
}

export default ListaFuncionarios;
