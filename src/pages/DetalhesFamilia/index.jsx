import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { User, MapPin, Users, Pencil } from "lucide-react";
import PaginaFormulario from "../../components/PaginaFormulario/PaginaFormulario";
import Botao from "../../components/Botao/Botao";
import FotoAvatar from "../../components/FotoAvatar/FotoAvatar";
import ImagemLista from "../../components/ImagemLista/ImagemLista";
import CartaoSecao from "../../components/CartaoSecao/CartaoSecao";
import CampoDetalhe from "../../components/CampoDetalhe/CampoDetalhe";
import Selo from "../../components/Selo/Selo";
import ListaContainer from "../../components/ListaContainer/ListaContainer";
import ListaStatus from "../../components/ListaStatus/ListaStatus";
import { mascaraCpf, mascaraRg, mascaraTelefone, mascaraCep } from "../../utils/mascaras";
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

    const logradouroCompleto = endereco?.logradouro
        ? `${endereco.logradouro}${endereco.numero ? `, ${endereco.numero}` : ''}`
        : '-';

    return (
        <PaginaFormulario
            nomeTela='Detalhes da Família'
            acao={
                <Botao
                    nome='Editar cadastro'
                    icone={Pencil}
                    cor='#137D91'
                    acao={() => navigate(`/familias/${id}/editar-familia`)}
                />
            }
            comCartao={false}
            carregando={carregando}
            carregandoTexto='Carregando família...'
            encontrado={!!familia}
            naoEncontradoTexto='Família não encontrada.'
            feedback={feedback}
            onFecharFeedback={fecharFeedback}
        >
            <ListaContainer gap='gap-6'>
                <CartaoSecao
                    titulo='Dados do Responsável'
                    Icone={User}
                    extra={<Selo texto='Cadastro Ativo' />}
                >
                    <div className='flex flex-col sm:flex-row items-start gap-6'>
                        <ImagemLista tamanho='w-28 h-28'>
                            <FotoAvatar
                                caminho={familia?.fotoFamilia}
                                alt={`Foto da família ${familia?.nomeFamilia}`}
                                Icone={Users}
                                tamanhoIcone={36}
                            />
                        </ImagemLista>

                        <div className='grid grid-cols-2 sm:grid-cols-4 gap-x-6 gap-y-4 flex-1 min-w-0 w-full'>
                            <CampoDetalhe rotulo='Nome Completo' valor={responsavel?.nome} />
                            <CampoDetalhe rotulo='CPF' valor={responsavel?.cpf ? mascaraCpf(responsavel.cpf) : '-'} />
                            <CampoDetalhe rotulo='RG' valor={responsavel?.rg ? mascaraRg(responsavel.rg) : '-'} />
                            <CampoDetalhe rotulo='Telefone' valor={responsavel?.telefone ? mascaraTelefone(responsavel.telefone) : '-'} />
                            <CampoDetalhe rotulo='Data de Nascimento' valor={converterDataParaBr(responsavel?.dataNascimento)} />
                            <CampoDetalhe rotulo='Profissão' valor={responsavel?.profissao} />
                            <CampoDetalhe rotulo='PNE' valor={familia?.possuiPrioridade ? 'Sim' : 'Não'} />
                            <CampoDetalhe rotulo='Sexo' valor={responsavel?.sexo} />
                        </div>
                    </div>
                </CartaoSecao>

                <CartaoSecao titulo='Dados do Endereço' Icone={MapPin}>
                    <div className='grid grid-cols-2 sm:grid-cols-3 gap-x-6 gap-y-4'>
                        <CampoDetalhe rotulo='Logradouro' valor={logradouroCompleto} />
                        <CampoDetalhe rotulo='Bairro' valor={endereco?.bairro} />
                        <CampoDetalhe rotulo='CEP' valor={endereco?.cep ? mascaraCep(endereco.cep) : '-'} />
                        <CampoDetalhe rotulo='Cidade' valor={endereco?.cidade} />
                        <CampoDetalhe rotulo='Estado' valor={endereco?.enderecoEstado?.sigla} />
                    </div>
                </CartaoSecao>

                <CartaoSecao
                    titulo='Dependentes'
                    Icone={Users}
                    extra={
                        <span className='text-sm font-bold text-cifa-turquesa'>
                            {dependentes.length} cadastrado{dependentes.length !== 1 ? 's' : ''}
                        </span>
                    }
                >
                    <ListaStatus
                        carregando={false}
                        vazio={dependentes.length === 0}
                        mensagemVazia='Nenhum dependente cadastrado.'
                    />

                    {dependentes.length > 0 && (
                        <div className='rounded-xl border border-cifa-linha overflow-hidden'>
                            <div className='hidden sm:grid sm:grid-cols-4 gap-4 px-4 py-3 bg-cifa-fundo/60 text-xs font-bold tracking-wide text-cifa-apagado uppercase'>
                                <span>Nome Completo</span>
                                <span>Parentesco</span>
                                <span>Nascimento</span>
                                <span>Sexo</span>
                            </div>

                            <div className='divide-y divide-cifa-linha'>
                                {dependentes.map((dep) => (
                                    <div key={dep.id} className='grid grid-cols-2 sm:grid-cols-4 gap-x-4 gap-y-3 px-4 py-3'>
                                        <CampoDetalhe rotulo='Nome Completo' valor={dep.nome} ocultarRotuloEmTelasGrandes />
                                        <CampoDetalhe rotulo='Parentesco' valor={dep.grauParentesco} ocultarRotuloEmTelasGrandes />
                                        <CampoDetalhe rotulo='Nascimento' valor={converterDataParaBr(dep.dataNascimento)} ocultarRotuloEmTelasGrandes />
                                        <CampoDetalhe rotulo='Sexo' valor={dep.sexo} ocultarRotuloEmTelasGrandes />
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </CartaoSecao>
            </ListaContainer>
        </PaginaFormulario>
    );
}

export default DetalhesFamilia;
