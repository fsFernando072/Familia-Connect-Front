import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import PaginaFormulario from "../../components/PaginaFormulario/PaginaFormulario";
import Formulario from "../../components/Formulario/Formulario";
import { buscarCargoPorId, atualizarCargo, listarCargosAcessos, PERMISSOES_CARGO } from "../../services/cargoService";

function EditarCargo() {

    const { id } = useParams();
    const navigate = useNavigate();
    const [carregando, setCarregando] = useState(true);
    const [cargoEncontrado, setCargoEncontrado] = useState(true);
    const [nome, setNome] = useState("");
    const [descricao, setDescricao] = useState("");
    const [idsPermissoes, setIdsPermissoes] = useState([]);
    const [associacoesAtuais, setAssociacoesAtuais] = useState([]);
    const [feedback, setFeedback] = useState({ tipo: '', msg: '', loading: false });

    const fecharFeedback = () => setFeedback({ tipo: '', msg: '', loading: false });

    useEffect(() => {
        async function carregarCargo() {
            setCarregando(true);

            const [cargo, todasAssociacoes] = await Promise.all([
                buscarCargoPorId(id),
                listarCargosAcessos(),
            ]);

            if (!cargo) {
                setCargoEncontrado(false);
                setCarregando(false);
                return;
            }

            const associacoesDoCargo = todasAssociacoes.filter((a) => a.cargoId === Number(id));

            setNome(cargo.nome || "");
            setAssociacoesAtuais(associacoesDoCargo);
            setIdsPermissoes(associacoesDoCargo.map((a) => `${a.acessoId}:${a.permissaoId}`));
            setCarregando(false);
        }
        carregarCargo();
    }, [id]);

    const handleAtualizar = () => {
        atualizarCargo(id, nome, idsPermissoes, associacoesAtuais, navigate, setFeedback);
    };

    const campos = [
        {
            id: 'nome',
            tipo: 'texto',
            coluna: 1,
            label: 'Nome do Cargo:',
            value: nome,
            onChange: (e) => setNome(e.target.value),
            placeholder: 'Recepcionista'
        },
        {
            id: 'permissoes',
            tipo: 'checkbox',
            coluna: 1,
            label: 'Permissões no Sistema para o Cargo:',
            opcoes: PERMISSOES_CARGO,
            value: idsPermissoes,
            onChange: setIdsPermissoes
        },
        {
            id: 'descricao',
            tipo: 'textarea',
            coluna: 2,
            label: 'Descrição do Cargo:',
            value: descricao,
            onChange: (e) => setDescricao(e.target.value),
            placeholder: 'Descreva as responsabilidades do cargo',
            ajuda: 'Este campo ainda não é salvo pelo back-end (CargoRequestDto não possui "descricao").'
        },
    ];

    return (
        <PaginaFormulario
            nomeTela='Editar Cargo'
            navegabilidade={{ ocultarSegmento: id, rotuloFinal: nome ? `Editar Cargo (${nome})` : undefined }}
            carregando={carregando}
            carregandoTexto='Carregando cargo...'
            encontrado={cargoEncontrado}
            naoEncontradoTexto='Cargo não encontrado.'
            feedback={feedback}
            onFecharFeedback={fecharFeedback}
            containerClassName='px-6 py-6 max-w-4xl mx-auto'
        >
            <Formulario
                campos={campos}
                colunas={2}
                nomeBotao='Confirmar'
                corBotao='#34C759'
                acaoBotao={handleAtualizar}
            />
        </PaginaFormulario>
    );
}

export default EditarCargo;
