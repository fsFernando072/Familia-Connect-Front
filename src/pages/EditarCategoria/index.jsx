import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import PaginaFormulario from "../../components/PaginaFormulario/PaginaFormulario";
import Formulario from "../../components/Formulario/Formulario";
import { buscarCategoriaPorId, atualizarCategoria } from "../../services/categoriaService";
import { useFeedback } from "../../hooks/useFeedback";

function EditarCategoria() {

    const { id } = useParams();
    const navigate = useNavigate();
    const [carregando, setCarregando] = useState(true);
    const [categoriaEncontrada, setCategoriaEncontrada] = useState(true);
    const { feedback, setFeedback, fecharFeedback } = useFeedback();
    const [nomeCategoria, setNomeCategoria] = useState("");


    useEffect(() => {
        async function carregarCategoria() {
            setCarregando(true);

            const categoria = await buscarCategoriaPorId(id);

            if (!categoria) {
                setCategoriaEncontrada(false);
                setCarregando(false);
                return;
            }

            setNomeCategoria(categoria.nome || "");
            setCarregando(false);
        }
        carregarCategoria();
    }, [id]);

    const handleAtualizar = () => {
        atualizarCategoria(id, nomeCategoria, navigate, setFeedback);
    };

    const campos = [
        {
            id: 'nome',
            tipo: 'texto',
            coluna: 1,
            label: 'Nome da Categoria',
            value: nomeCategoria,
            onChange: (e) => setNomeCategoria(e.target.value),
            placeholder: 'Vestimenta'
        },
    ];

    return (
        <PaginaFormulario
            nomeTela='Editar Categoria'
            carregando={carregando}
            carregandoTexto='Carregando categoria...'
            encontrado={categoriaEncontrada}
            naoEncontradoTexto='Categoria não encontrada.'
            feedback={feedback}
            onFecharFeedback={fecharFeedback}
        >
            <Formulario
                campos={campos}
                nomeBotao='Confirmar'
                corBotao='#44BEB7'
                acaoBotao={handleAtualizar}
                alinhamentoBotao='end'
            />
        </PaginaFormulario>
    );
}

export default EditarCategoria;
