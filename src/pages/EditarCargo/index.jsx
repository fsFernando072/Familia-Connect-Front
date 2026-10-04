import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import PaginaFormulario from "../../components/PaginaFormulario/PaginaFormulario";
import Formulario from "../../components/Formulario/Formulario";
import { useFeedback } from "../../hooks/useFeedback";
import { LIMITES } from "../../services/limitesCampos";
import { buscarCargoPorId, atualizarCargo, permissoesParaEstado, PAGINAS, NIVEIS_ACESSO, NIVEL_PADRAO } from "../../services/cargoService";
import { COR_MENTA } from "../../utils/cores";

function EditarCargo() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { feedback, setFeedback, fecharFeedback } = useFeedback();

    const [carregando, setCarregando] = useState(true);
    const [cargoEncontrado, setCargoEncontrado] = useState(true);
    const [nome, setNome] = useState("");
    const [descricao, setDescricao] = useState("");
    const [permissoes, setPermissoes] = useState({});

    useEffect(() => {
        async function carregarCargo() {
            setCarregando(true);

            const cargo = await buscarCargoPorId(id);

            if (!cargo) {
                setCargoEncontrado(false);
                setCarregando(false);
                return;
            }

            setNome(cargo.nome || "");
            setDescricao(cargo.descricao || "");
            setPermissoes(permissoesParaEstado(cargo.permissoes));
            setCarregando(false);
        }
        carregarCargo();
    }, [id]);

    const handleAtualizar = () => {
        atualizarCargo(id, nome, descricao, permissoes, navigate, setFeedback);
    };

    const campos = [
        {
            id: "nome",
            tipo: "texto",
            coluna: 1,
            label: "Nome do Cargo",
            value: nome,
            onChange: (e) => setNome(e.target.value),
            maxLength: LIMITES.cargo.nome.max,
            placeholder: "Recepcionista",
        },
        {
            id: "permissoes",
            tipo: "permissoes",
            coluna: 1,
            label: "Páginas que o Cargo pode acessar",
            paginas: PAGINAS,
            niveis: NIVEIS_ACESSO,
            nivelPadrao: NIVEL_PADRAO,
            value: permissoes,
            onChange: setPermissoes,
        },
        {
            id: "descricao",
            tipo: "textarea",
            coluna: 2,
            label: "Descrição do Cargo",
            value: descricao,
            onChange: (e) => setDescricao(e.target.value),
            maxLength: LIMITES.cargo.descricao.max,
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
            <Formulario campos={campos} colunas={2} nomeBotao="Confirmar" corBotao={COR_MENTA} acaoBotao={handleAtualizar} alinhamentoBotao="end" />
        </PaginaFormulario>
    );
}

export default EditarCargo;
