import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import PaginaFormulario from "../../components/PaginaFormulario/PaginaFormulario";
import Formulario from "../../components/Formulario/Formulario";
import { useFeedback } from "../../hooks/useFeedback";
import { buscarCargoPorId, atualizarCargo, listarCargosAcessos, PERMISSOES_CARGO } from "../../services/cargoService";
import { COR_MENTA } from "../../utils/cores";

function EditarCargo() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { feedback, setFeedback, fecharFeedback } = useFeedback();

    const [carregando, setCarregando] = useState(true);
    const [cargoEncontrado, setCargoEncontrado] = useState(true);
    const [nome, setNome] = useState("");
    const [descricao, setDescricao] = useState("");
    const [permissoesIds, setPermissoesIds] = useState([]);
    const [associacoesAtuais, setAssociacoesAtuais] = useState([]);

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

            const associacoesDoCargo = todasAssociacoes.filter((a) => a.cargo?.id === Number(id));

            setNome(cargo.nome || "");
            setDescricao(cargo.descricao || "");
            setAssociacoesAtuais(associacoesDoCargo);
            setPermissoesIds(associacoesDoCargo.map((a) => Number(a.acesso?.id)));
            setCarregando(false);
        }
        carregarCargo();
    }, [id]);

    const handleAtualizar = () => {
        atualizarCargo(id, nome, descricao, permissoesIds, associacoesAtuais, navigate, setFeedback);
    };

    const campos = [
        {
            id: "nome",
            tipo: "texto",
            coluna: 1,
            label: "Nome do Cargo",
            value: nome,
            onChange: (e) => setNome(e.target.value),
            placeholder: "Recepcionista",
        },
        {
            id: "permissoes",
            tipo: "checkbox",
            coluna: 1,
            label: "Permissões no Sistema para o Cargo",
            opcoes: PERMISSOES_CARGO,
            value: permissoesIds,
            onChange: setPermissoesIds,
        },
        {
            id: "descricao",
            tipo: "textarea",
            coluna: 2,
            label: "Descrição do Cargo",
            value: descricao,
            onChange: (e) => setDescricao(e.target.value),
            placeholder: "Descreva as responsabilidades do cargo",
        },
    ];

    return (
        <PaginaFormulario
            nomeTela="Editar Cargo"
            carregando={carregando}
            carregandoTexto="Carregando cargo..."
            encontrado={cargoEncontrado}
            naoEncontradoTexto="Cargo não encontrado."
            feedback={feedback}
            onFecharFeedback={fecharFeedback}
        >
            <Formulario
                campos={campos}
                colunas={2}
                nomeBotao="Confirmar"
                corBotao={COR_MENTA}
                acaoBotao={handleAtualizar}
                alinhamentoBotao="end"
            />
        </PaginaFormulario>
    );
}

export default EditarCargo;
