import { useState } from "react";
import { useNavigate } from "react-router-dom";
import PaginaFormulario from "../../components/PaginaFormulario/PaginaFormulario";
import Formulario from "../../components/Formulario/Formulario";
import { useFeedback } from "../../hooks/useFeedback";
import { cadastrarCargo, PAGINAS, NIVEIS_ACESSO, NIVEL_PADRAO } from "../../services/cargoService";
import { COR_MENTA } from "../../utils/cores";

function CadastroCargo() {
    const navigate = useNavigate();
    const { feedback, setFeedback, fecharFeedback } = useFeedback();

    const [nome, setNome] = useState("");
    const [descricao, setDescricao] = useState("");
    const [permissoes, setPermissoes] = useState({});

    const handleCadastrar = () => {
        cadastrarCargo(nome, descricao, permissoes, navigate, setFeedback);
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
            placeholder: "Descreva as responsabilidades do cargo",
        },
    ];

    return (
        <PaginaFormulario nomeTela="Cadastro de Cargo" feedback={feedback} onFecharFeedback={fecharFeedback}>
            <Formulario campos={campos} colunas={2} nomeBotao="Cadastrar" corBotao={COR_MENTA} acaoBotao={handleCadastrar} alinhamentoBotao="end" />
        </PaginaFormulario>
    );
}

export default CadastroCargo;
