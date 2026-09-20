import { useState } from "react";
import { useNavigate } from "react-router-dom";
import PaginaFormulario from "../../components/PaginaFormulario/PaginaFormulario";
import Formulario from "../../components/Formulario/Formulario";
import { cadastrarCategoria } from "../../services/categoriaService";
import { useFeedback } from "../../hooks/useFeedback";

function CadastroCategoria() {

    const navigate = useNavigate();
    const { feedback, setFeedback, fecharFeedback } = useFeedback();
    const [nomeCategoria, setNomeCategoria] = useState("");


    const handleCadastrar = () => {
        cadastrarCategoria(nomeCategoria, navigate, setFeedback);
    };

    const campos = [
        {
            id: 'nome',
            tipo: 'texto',
            coluna: 1,
            label: 'Nome Categoria',
            value: nomeCategoria,
            onChange: (e) => setNomeCategoria(e.target.value),
            placeholder: 'Vestimenta'
        },
    ];

    return (
        <PaginaFormulario nomeTela='Cadastro de Categoria de Produto' feedback={feedback} onFecharFeedback={fecharFeedback}>
            <Formulario
                campos={campos}
                nomeBotao='Cadastrar'
                corBotao='#34C759'
                acaoBotao={handleCadastrar}
                alinhamentoBotao='start'
            />
        </PaginaFormulario>
    );
}

export default CadastroCategoria;
