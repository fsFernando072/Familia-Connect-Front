import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import PaginaFormulario from "../../components/PaginaFormulario/PaginaFormulario";
import Formulario from "../../components/Formulario/Formulario";
import { buscarCategoriaPorId, atualizarCategoria } from "../../services/categoriaService";

function EditarCategoria() {

    const { id } = useParams();
    const navigate = useNavigate();
    const [carregando, setCarregando] = useState(true);
    const [categoriaEncontrada, setCategoriaEncontrada] = useState(true);
    const [feedback, setFeedback] = useState({ tipo: '', msg: '', loading: false });
    const [nomeCategoria, setNomeCategoria] = useState("");

    const fecharFeedback = () => setFeedback({ tipo: '', msg: '', loading: false });

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
            label: 'Nome Categoria',
            value: nomeCategoria,
            onChange: (e) => setNomeCategoria(e.target.value),
            placeholder: 'Vestimenta'
        },
    ];

    return (
        <PaginaFormulario
            nomeTela='Editar Categoria de Produto'
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
                corBotao='#34C759'
                acaoBotao={handleAtualizar}
                alinhamentoBotao='start'
            />
        </PaginaFormulario>
    );
}

export default EditarCategoria;
