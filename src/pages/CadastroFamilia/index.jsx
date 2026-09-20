import { useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import PaginaFormulario from "../../components/PaginaFormulario/PaginaFormulario";
import FormularioFamilia from "../../components/FormularioFamilia/FormularioFamilia";
import { dadosIniciaisDeOcr, dadosIniciaisVazios } from "../../components/FormularioFamilia/mapeamentos";
import { cadastrarFamilia } from "../../services/familiaService";
import { useFeedback } from "../../hooks/useFeedback";
import { useOpcoesFamilia } from "../../hooks/useOpcoesFamilia";
import { FEEDBACK_VAZIO, feedbackSucesso } from "../../utils/feedback";

function CadastroFamilia() {

    const navigate = useNavigate();
    const location = useLocation();

    // Vem preenchido quando o usuário importa uma foto na tela de lista.
    const dadosOcr = location.state?.dadosOcr;

    const { feedback, setFeedback, fecharFeedback } = useFeedback(() => dadosOcr
        ? feedbackSucesso('Dados preenchidos a partir da foto importada. Confira e complete as informações antes de cadastrar.')
        : FEEDBACK_VAZIO
    );
    const opcoes = useOpcoesFamilia();

    const dadosIniciais = useMemo(
        () => dadosOcr ? dadosIniciaisDeOcr(dadosOcr) : dadosIniciaisVazios(),
        [dadosOcr]
    );

    return (
        <PaginaFormulario nomeTela='Cadastro de Família' feedback={feedback} onFecharFeedback={fecharFeedback}>
            <FormularioFamilia
                dadosIniciais={dadosIniciais}
                opcoes={opcoes}
                nomeBotaoFinal='Cadastrar'
                preSelecionarSP
                onSalvar={(responsavel, endereco, dependentes) =>
                    cadastrarFamilia(responsavel, endereco, dependentes, navigate, setFeedback)}
                setFeedback={setFeedback}
                fecharFeedback={fecharFeedback}
            />
        </PaginaFormulario>
    );
}

export default CadastroFamilia;
