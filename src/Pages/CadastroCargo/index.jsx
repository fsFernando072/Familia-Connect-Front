import { useState } from "react";
import { useNavigate } from "react-router-dom";
import PaginaFormulario from "../../components/PaginaFormulario/PaginaFormulario";
import Formulario from "../../components/Formulario/Formulario";
import { cadastrarCargo, PERMISSOES_CARGO } from "../../services/cargoService";

function CadastroCargo() {

    const navigate = useNavigate();
    const [nome, setNome] = useState("");
    const [descricao, setDescricao] = useState("");
    const [idsPermissoes, setIdsPermissoes] = useState([]);
    const [feedback, setFeedback] = useState({ tipo: '', msg: '', loading: false });

    const fecharFeedback = () => setFeedback({ tipo: '', msg: '', loading: false });

    const handleCadastrar = () => {
        cadastrarCargo(nome, idsPermissoes, navigate, setFeedback);
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
            placeholder: 'Descreva as responsabilidades do cargo'
        },
    ];

    return (
        <PaginaFormulario
            nomeTela='Cadastro de Cargo'
            feedback={feedback}
            onFecharFeedback={fecharFeedback}
            containerClassName='px-6 py-6 max-w-4xl mx-auto'
        >
            <Formulario
                campos={campos}
                colunas={2}
                nomeBotao='Cadastrar'
                corBotao='#34C759'
                acaoBotao={handleCadastrar}
            />
        </PaginaFormulario>
    );
}

export default CadastroCargo;
