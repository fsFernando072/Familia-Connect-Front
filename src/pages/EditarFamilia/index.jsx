import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import PaginaFormulario from "../../components/PaginaFormulario/PaginaFormulario";
import FormularioFamilia from "../../components/FormularioFamilia/FormularioFamilia";
import { dadosIniciaisDaFamilia } from "../../components/FormularioFamilia/mapeamentos";
import { useFeedback } from "../../hooks/useFeedback";
import { useOpcoesFamilia } from "../../hooks/useOpcoesFamilia";
import { buscarFamiliaPorId, atualizarFamilia } from "../../services/familiaService";

function EditarFamilia() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { feedback, setFeedback, fecharFeedback } = useFeedback();

    const opcoes = useOpcoesFamilia();

    const [familia, setFamilia] = useState(null);
    const [carregandoFamilia, setCarregandoFamilia] = useState(true);

    useEffect(() => {
        let ativo = true;

        async function carregarFamilia() {
            setCarregandoFamilia(true);
            const dados = await buscarFamiliaPorId(id);
            if (!ativo) return;
            setFamilia(dados);
            setCarregandoFamilia(false);
        }
        carregarFamilia();

        return () => { ativo = false; };
    }, [id]);

    // Só monta os dados iniciais quando a família e as listas dos selects já chegaram.
    const dadosIniciais = useMemo(
        () => (familia && !opcoes.carregando) ? dadosIniciaisDaFamilia(familia, opcoes.profissoes) : null,
        [familia, opcoes.carregando, opcoes.profissoes]
    );

    return (
        <PaginaFormulario
            nomeTela="Editar Família"
            carregando={carregandoFamilia || opcoes.carregando}
            carregandoTexto="Carregando família..."
            encontrado={Boolean(familia)}
            naoEncontradoTexto="Família não encontrada."
            feedback={feedback}
            onFecharFeedback={fecharFeedback}
        >
            <FormularioFamilia
                key={id}
                dadosIniciais={dadosIniciais}
                opcoes={opcoes}
                labelImagem="Trocar Imagem"
                nomeBotaoFinal="Confirmar"
                onSalvar={(responsavel, endereco, dependentes) =>
                    atualizarFamilia(id, responsavel, endereco, dependentes, navigate, setFeedback)}
                setFeedback={setFeedback}
                fecharFeedback={fecharFeedback}
            />
        </PaginaFormulario>
    );
}

export default EditarFamilia;
