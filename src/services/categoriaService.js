import api from "./apiClient";

export async function listarCategorias() {
    try {
        const response = await api.get('/categorias');

        if (response.status === 200) {
            return response.data;
        }

        return [];
    } catch (error) {
        console.error('Erro ao buscar categorias:', error);
        return [];
    }
}

export async function buscarCategoriaPorId(id) {
    try {
        const response = await api.get(`/categorias/${id}`);

        if (response.status === 200) return response.data;
        return null;
    } catch (error) {
        console.error('Erro ao buscar categoria:', error);
        return null;
    }
}

export async function deletarCategoria(id) {
    try {
        const response = await api.delete(`/categorias/${id}`);

        return response.status === 204;
    } catch (error) {
        console.error('Erro ao apagar categoria:', error);
        return false;
    }
}

function validarDadosCategoria(nome, setFeedback) {
    if (!nome) {
        setFeedback({ tipo: 'erro', msg: 'Informe o nome da categoria.', loading: false });
        return false;
    }

    return true;
}

export async function cadastrarCategoria(nome, navigate, setFeedback) {

    if (!validarDadosCategoria(nome, setFeedback)) return;

    setFeedback({ tipo: '', msg: 'Cadastrando categoria...', loading: true });

    try {
        const response = await api.post('/categorias', { nome });

        if (response.status === 201) {
            setFeedback({ tipo: 'sucesso', msg: 'Categoria cadastrada com sucesso!', loading: false });
            setTimeout(() => navigate("/categorias"), 2000);
        } else if (response.status === 409) {
            setFeedback({ tipo: 'erro', msg: 'Categoria já cadastrada. Nenhum dado foi salvo.', loading: false });
        } else if (response.status === 401) {
            setFeedback({ tipo: 'erro', msg: 'Ação não autorizada.', loading: false });
        } else {
            setFeedback({ tipo: 'erro', msg: 'Não foi possível cadastrar a categoria. Nenhum dado foi salvo.', loading: false });
        }
    } catch {
        setFeedback({ tipo: 'erro', msg: 'Erro de conexão. Nenhum dado foi salvo.', loading: false });
    }
}

export async function atualizarCategoria(id, nome, navigate, setFeedback) {

    if (!validarDadosCategoria(nome, setFeedback)) return;

    setFeedback({ tipo: '', msg: 'Atualizando categoria...', loading: true });

    try {
        const response = await api.put(`/categorias/${id}`, { nome });

        if (response.status === 200) {
            setFeedback({ tipo: 'sucesso', msg: 'Categoria atualizada com sucesso!', loading: false });
            setTimeout(() => navigate("/categorias"), 2000);
        } else if (response.status === 409) {
            setFeedback({ tipo: 'erro', msg: 'Categoria já cadastrada para outro nome. Nenhum dado foi salvo.', loading: false });
        } else if (response.status === 404) {
            setFeedback({ tipo: 'erro', msg: 'Categoria não encontrada.', loading: false });
        } else if (response.status === 401) {
            setFeedback({ tipo: 'erro', msg: 'Ação não autorizada.', loading: false });
        } else {
            setFeedback({ tipo: 'erro', msg: 'Não foi possível atualizar a categoria.', loading: false });
        }
    } catch {
        setFeedback({ tipo: 'erro', msg: 'Erro de conexão. Nenhum dado foi salvo.', loading: false });
    }
}