import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import PaginaFormulario from "../../components/PaginaFormulario/PaginaFormulario";
import Formulario from "../../components/Formulario/Formulario";
import { useFeedback } from "../../hooks/useFeedback";
import { buscarCategoriaPorId, atualizarCategoria } from "../../services/categoriaService";
import { COR_MENTA } from "../../utils/cores";

function EditarCategoria() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { feedback, setFeedback, fecharFeedback } = useFeedback();

    const [carregando, setCarregando] = useState(true);
    const [categoriaEncontrada, setCategoriaEncontrada] = useState(true);
    const [nome, setNome] = useState("");

    useEffect(() => {
        async function carregarCategoria() {
            setCarregando(true);

            const categoria = await buscarCategoriaPorId(id);

            if (!categoria) {
                setCategoriaEncontrada(false);
                setCarregando(false);
                return;
            }

            setNome(categoria.nome || "");
            setCarregando(false);
        }
        carregarCategoria();
    }, [id]);

    const handleAtualizar = () => {
        atualizarCategoria(id, nome, navigate, setFeedback);
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
        <PaginaFormulario
            nomeTela="Editar Categoria"
            carregando={carregando}
            carregandoTexto="Carregando categoria..."
            encontrado={categoriaEncontrada}
            naoEncontradoTexto="Categoria não encontrada."
            feedback={feedback}
            onFecharFeedback={fecharFeedback}
        >
            <Formulario campos={campos} nomeBotao="Confirmar" corBotao={COR_MENTA} acaoBotao={handleAtualizar} alinhamentoBotao="end" />
        </PaginaFormulario>
    );
}

export default EditarCategoria;
