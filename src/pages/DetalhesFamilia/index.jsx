import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Users } from "lucide-react";
import PaginaFormulario from "../../components/PaginaFormulario/PaginaFormulario";
import Botao from "../../components/Botao/Botao";
import FotoAvatar from "../../components/FotoAvatar/FotoAvatar";
import ImagemLista from "../../components/ImagemLista/ImagemLista";
import CartaoInfo from "../../components/CartaoInfo/CartaoInfo";
import LinhaInfo from "../../components/LinhaInfo/LinhaInfo";
import ListaContainer from "../../components/ListaContainer/ListaContainer";
import ListaStatus from "../../components/ListaStatus/ListaStatus";
import { mascaraCpf, mascaraRg, mascaraTelefone } from "../../utils/mascaras";
import { converterDataParaBr } from "../../utils/formatadores";
import { buscarFamiliaPorId } from "../../services/familiaService";
import { useFeedback } from "../../hooks/useFeedback";

function DetalhesFamilia() {

    const { id } = useParams();
    const navigate = useNavigate();
    const [familia, setFamilia] = useState(null);
    const [carregando, setCarregando] = useState(true);
    const { feedback, fecharFeedback } = useFeedback();

    useEffect(() => {
        async function carregarFamilia() {
            setCarregando(true);
            const dados = await buscarFamiliaPorId(id);
            setFamilia(dados);
            setCarregando(false);
        }
        carregarFamilia();
    }, [id]);

    const responsavel = familia?.responsavel;
    const endereco = familia?.endereco;
    const dependentes = familia?.dependentes || [];

    return (
        <PaginaFormulario
            nomeTela='Detalhes da Família'
            comCartao={false}
            carregando={carregando}
            carregandoTexto='Carregando família...'
            encontrado={!!familia}
            naoEncontradoTexto='Família não encontrada.'
            feedback={feedback}
            onFecharFeedback={fecharFeedback}
        >
            <ListaContainer gap='gap-6'>
                <div className='flex flex-col sm:flex-row items-start gap-6'>
                    <ImagemLista tamanho='w-28 h-28'>
                        <FotoAvatar
                            caminho={familia?.fotoFamilia}
                            alt={`Foto da família ${familia?.nomeFamilia}`}
                            Icone={Users}
                            tamanhoIcone={36}
                        />
                    </ImagemLista>

                    <div className='flex-1 min-w-0 w-full'>
                        <h2 className='text-xl font-extrabold text-cifa-navy mb-3'>Dados do Responsável</h2>
                        <CartaoInfo colunas={2}>
                            <LinhaInfo rotulo='Nome Completo' valor={responsavel?.nome || '-'} />
                            <LinhaInfo rotulo='CPF' valor={responsavel?.cpf ? mascaraCpf(responsavel.cpf) : '-'} />
                            <LinhaInfo rotulo='RG' valor={responsavel?.rg ? mascaraRg(responsavel.rg) : '-'} />
                            <LinhaInfo rotulo='Telefone' valor={responsavel?.telefone ? mascaraTelefone(responsavel.telefone) : '-'} />
                            <LinhaInfo rotulo='Data de Nascimento' valor={converterDataParaBr(responsavel?.dataNascimento) || '-'} />
                            <LinhaInfo rotulo='PNE' valor={familia?.possuiPrioridade ? 'Sim' : 'Não'} />
                            <LinhaInfo rotulo='Profissão' valor={responsavel?.profissao || '-'} />
                            <LinhaInfo rotulo='Sexo' valor={responsavel?.sexo || '-'} />
                        </CartaoInfo>
                    </div>
                </div>

                <div>
                    <h2 className='text-xl font-extrabold text-cifa-navy mb-3'>Dados do Endereço</h2>
                    <CartaoInfo colunas={3}>
                        <LinhaInfo rotulo='CEP' valor={endereco?.cep || '-'} />
                        <LinhaInfo rotulo='Rua' valor={endereco?.logradouro || '-'} />
                        <LinhaInfo rotulo='Número' valor={endereco?.numero ?? '-'} />
                        <LinhaInfo rotulo='Bairro' valor={endereco?.bairro || '-'} />
                        <LinhaInfo rotulo='Cidade' valor={endereco?.cidade || '-'} />
                        <LinhaInfo rotulo='Estado' valor={endereco?.enderecoEstado?.sigla || '-'} />
                    </CartaoInfo>
                </div>

                <div>
                    <h2 className='text-xl font-extrabold text-cifa-navy mb-3'>Dados dos Dependentes</h2>

                    <ListaStatus
                        carregando={false}
                        vazio={dependentes.length === 0}
                        mensagemVazia='Nenhum dependente cadastrado.'
                    />

                    <ListaContainer gap='gap-3'>
                        {dependentes.map((dep) => (
                            <CartaoInfo key={dep.id} colunas={3}>
                                <LinhaInfo rotulo='Nome Completo' valor={dep.nome} />
                                <LinhaInfo rotulo='Parentesco' valor={dep.grauParentesco || '-'} />
                                <LinhaInfo rotulo='Data de Nascimento' valor={converterDataParaBr(dep.dataNascimento) || '-'} />
                                <LinhaInfo rotulo='Sexo' valor={dep.sexo || '-'} />
                            </CartaoInfo>
                        ))}
                    </ListaContainer>
                </div>

                <div>
                    <Botao nome='Editar' cor='#137D91' acao={() => navigate(`/familias/${id}/editar-familia`)} />
                </div>
            </ListaContainer>
        </PaginaFormulario>
    );
}

export default DetalhesFamilia;
