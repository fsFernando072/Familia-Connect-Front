import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Users } from "lucide-react";
import Header from "../../components/Header/Header";
import Navegabilidade from "../../components/Navegabilidade/Navegabilidade";
import Botao from "../../components/Botao/Botao";
import { mascaraCpf, mascaraRg, mascaraTelefone } from "../../utils/mascaras";
import { converterDataParaBr } from "../../utils/formatadores";
import { buscarFamiliaPorId } from "../../services/familiaService";

function DetalhesFamilia() {

    const { id } = useParams();
    const navigate = useNavigate();
    const [familia, setFamilia] = useState(null);
    const [carregando, setCarregando] = useState(true);

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
        <div className='w-full min-h-screen overflow-x-hidden bg-gray-100'>
            <Header nomeTela='Detalhes Família' />
            <Navegabilidade />

            <div className='px-6 py-6 max-w-4xl mx-auto flex flex-col gap-6'>
                {carregando && (
                    <p className='text-gray-500 text-center mt-10'>Carregando família...</p>
                )}

                {!carregando && !familia && (
                    <p className='text-gray-500 text-center mt-10'>Família não encontrada.</p>
                )}

                {!carregando && familia && (
                    <>
                        <div className='flex flex-col sm:flex-row items-start gap-6'>
                            <div className='w-28 h-28 rounded-md bg-gray-100 border border-gray-200 flex items-center justify-center flex-shrink-0'>
                                {familia.fotoFamilia ? (
                                    <img
                                        src={`http://localhost:8080${familia.fotoFamilia}`}
                                        alt={`Foto da família ${familia.nomeFamilia}`}
                                        className='w-full h-full object-cover'
                                    />
                                ) : (
                                    <Users size={36} className='text-gray-400' />
                                )}
                            </div>

                            <div className='flex-1 min-w-0 w-full'>
                                <h2 className='text-xl font-bold text-gray-900 mb-3'>Dados do Responsável</h2>
                                <div className='grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2 bg-white border border-gray-800 rounded-md p-4'>
                                    <p className='truncate'><span className='font-bold text-gray-900'>Nome Completo: </span><span className='text-gray-500'>{responsavel?.nome || '-'}</span></p>
                                    <p className='truncate'><span className='font-bold text-gray-900'>CPF: </span><span className='text-gray-500'>{responsavel?.cpf ? mascaraCpf(responsavel.cpf) : '-'}</span></p>
                                    <p className='truncate'><span className='font-bold text-gray-900'>RG: </span><span className='text-gray-500'>{responsavel?.rg ? mascaraRg(responsavel.rg) : '-'}</span></p>
                                    <p className='truncate'><span className='font-bold text-gray-900'>Telefone: </span><span className='text-gray-500'>{responsavel?.telefone ? mascaraTelefone(responsavel.telefone) : '-'}</span></p>
                                    <p className='truncate'><span className='font-bold text-gray-900'>Data de Nascimento: </span><span className='text-gray-500'>{converterDataParaBr(responsavel?.dataNascimento) || '-'}</span></p>
                                    <p className='truncate'><span className='font-bold text-gray-900'>PNE: </span><span className='text-gray-500'>{familia.possuiPrioridade ? 'Sim' : 'Não'}</span></p>
                                    <p className='truncate'><span className='font-bold text-gray-900'>Profissão: </span><span className='text-gray-500'>{responsavel?.profissao || '-'}</span></p>
                                    <p className='truncate'><span className='font-bold text-gray-900'>Sexo: </span><span className='text-gray-500'>{responsavel?.sexo || '-'}</span></p>
                                </div>
                            </div>
                        </div>

                        <div>
                            <h2 className='text-xl font-bold text-gray-900 mb-3'>Dados do Endereço</h2>
                            <div className='grid grid-cols-1 sm:grid-cols-3 gap-x-8 gap-y-2 bg-white border border-gray-800 rounded-md p-4'>
                                <p className='truncate'><span className='font-bold text-gray-900'>CEP: </span><span className='text-gray-500'>{endereco?.cep || '-'}</span></p>
                                <p className='truncate'><span className='font-bold text-gray-900'>Rua: </span><span className='text-gray-500'>{endereco?.logradouro || '-'}</span></p>
                                <p className='truncate'><span className='font-bold text-gray-900'>Número: </span><span className='text-gray-500'>{endereco?.numero ?? '-'}</span></p>
                                <p className='truncate'><span className='font-bold text-gray-900'>Bairro: </span><span className='text-gray-500'>{endereco?.bairro || '-'}</span></p>
                                <p className='truncate'><span className='font-bold text-gray-900'>Cidade: </span><span className='text-gray-500'>{endereco?.cidade || '-'}</span></p>
                                <p className='truncate'><span className='font-bold text-gray-900'>Estado: </span><span className='text-gray-500'>{endereco?.enderecoEstado?.sigla || '-'}</span></p>
                            </div>
                        </div>

                        <div>
                            <h2 className='text-xl font-bold text-gray-900 mb-3'>Dados dos Dependentes</h2>

                            {dependentes.length === 0 && (
                                <p className='text-gray-500'>Nenhum dependente cadastrado.</p>
                            )}

                            <div className='flex flex-col gap-3'>
                                {dependentes.map((dep) => (
                                    <div key={dep.id} className='grid grid-cols-1 sm:grid-cols-3 gap-x-8 gap-y-2 bg-white border border-gray-800 rounded-md p-4'>
                                        <p className='truncate'><span className='font-bold text-gray-900'>Nome Completo: </span><span className='text-gray-500'>{dep.nome}</span></p>
                                        <p className='truncate'><span className='font-bold text-gray-900'>Parentesco: </span><span className='text-gray-500'>{dep.grauParentesco || '-'}</span></p>
                                        <p className='truncate'><span className='font-bold text-gray-900'>Data de Nascimento: </span><span className='text-gray-500'>{converterDataParaBr(dep.dataNascimento) || '-'}</span></p>
                                        <p className='truncate'><span className='font-bold text-gray-900'>Sexo: </span><span className='text-gray-500'>{dep.sexo || '-'}</span></p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div>
                            <Botao nome='Editar' cor='#167AFA' acao={() => navigate(`/familias/${id}/editar-familia`)} larguraBotao='' />
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}

export default DetalhesFamilia;
