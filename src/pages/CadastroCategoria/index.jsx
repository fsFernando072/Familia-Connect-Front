import { useState } from "react";
import { useNavigate } from "react-router-dom";
import PaginaFormulario from "../../components/PaginaFormulario/PaginaFormulario";
import Formulario from "../../components/Formulario/Formulario";
import { useFeedback } from "../../hooks/useFeedback";
import { cadastrarCategoria } from "../../services/categoriaService";
import { COR_MENTA } from "../../utils/cores";

function CadastroCategoria() {
    const navigate = useNavigate();
    const { feedback, setFeedback, fecharFeedback } = useFeedback();

    const [nome, setNome] = useState("");

    const handleCadastrar = () => {
        cadastrarCategoria(nome, navigate, setFeedback);
    };

    const campos = [
        {
            id: "nome",
            tipo: "texto",
            coluna: 1,
            label: "Nome da Categoria",
            value: nome,
            onChange: (e) => setNome(e.target.value),
            placeholder: "Vestimenta",
        },
    ];

    return (
        <PaginaFormulario nomeTela="Cadastro de Categoria" feedback={feedback} onFecharFeedback={fecharFeedback}>
            <Formulario campos={campos} nomeBotao="Cadastrar" corBotao={COR_MENTA} acaoBotao={handleCadastrar} alinhamentoBotao="end" />
        </PaginaFormulario>
    );
}

export default CadastroCategoria;
