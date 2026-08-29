import api from "./apiClient";

export async function listarProdutos() {
    try {
        const response = await api.get('/produtos');

        if (response.status === 200) {
            return response.data;
        }

        return [];
    } catch (error) {
        console.error('Erro ao buscar produtos:', error);
        return [];
    }
}

export async function buscarProdutoPorId(id) {
    try {
        const response = await api.get(`/produtos/${id}`);

        if (response.status === 200) return response.data;
        return null;
    } catch (error) {
        console.error('Erro ao buscar produto:', error);
        return null;
    }
}

export async function deletarProduto(id) {
    try {
        const response = await api.delete(`/produtos/${id}`);

        return response.status === 204;
    } catch (error) {
        console.error('Erro ao apagar produto:', error);
        return false;
    }
}

function validarDadosProduto(produto, setFeedback) {
    if (!produto.nome || !produto.categoriaId) {
        setFeedback({ tipo: 'erro', msg: 'Preencha o nome do produto e selecione uma categoria.', loading: false });
        return false;
    }

    return true;
}

function montarPayloadProduto(produto) {
    return {
        nome: produto.nome,
        descricao: produto.descricao || null,
        idCategoria: Number(produto.categoriaId)
    };
}

export async function cadastrarProduto(produto, navigate, setFeedback) {

    if (!validarDadosProduto(produto, setFeedback)) return;

    setFeedback({ tipo: '', msg: 'Cadastrando produto...', loading: true });

    const payload = montarPayloadProduto(produto);

    try {
        const response = await api.post('/produtos', payload);

        if (response.status === 201) {
            setFeedback({ tipo: 'sucesso', msg: 'Produto cadastrado com sucesso!', loading: false });
            setTimeout(() => navigate("/produtos"), 2000);
        } else if (response.status === 409) {
            setFeedback({ tipo: 'erro', msg: 'Produto já cadastrado. Nenhum dado foi salvo.', loading: false });
        } else if (response.status === 404) {
            setFeedback({ tipo: 'erro', msg: 'Categoria informada não foi encontrada. Nenhum dado foi salvo.', loading: false });
        } else if (response.status === 401) {
            setFeedback({ tipo: 'erro', msg: 'Ação não autorizada.', loading: false });
        } else {
            setFeedback({ tipo: 'erro', msg: 'Não foi possível cadastrar o produto. Nenhum dado foi salvo.', loading: false });
        }
    } catch {
        setFeedback({ tipo: 'erro', msg: 'Erro de conexão. Nenhum dado foi salvo.', loading: false });
    }
}

export async function atualizarProduto(id, produto, navigate, setFeedback) {

    if (!validarDadosProduto(produto, setFeedback)) return;

    setFeedback({ tipo: '', msg: 'Atualizando produto...', loading: true });

    const payload = montarPayloadProduto(produto);

    try {
        const response = await api.put(`/produtos/${id}`, payload);

        if (response.status === 200) {
            setFeedback({ tipo: 'sucesso', msg: 'Produto atualizado com sucesso!', loading: false });
            setTimeout(() => navigate("/produtos"), 2000);
        } else if (response.status === 409) {
            setFeedback({ tipo: 'erro', msg: 'Produto já cadastrado para outra categoria. Nenhum dado foi salvo.', loading: false });
        } else if (response.status === 404) {
            setFeedback({ tipo: 'erro', msg: 'Produto ou categoria não encontrados.', loading: false });
        } else if (response.status === 401) {
            setFeedback({ tipo: 'erro', msg: 'Ação não autorizada.', loading: false });
        } else {
            setFeedback({ tipo: 'erro', msg: 'Não foi possível atualizar o produto.', loading: false });
        }
    } catch {
        setFeedback({ tipo: 'erro', msg: 'Erro de conexão. Nenhum dado foi salvo.', loading: false });
    }
}