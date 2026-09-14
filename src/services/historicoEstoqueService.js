import api from "./apiClient";

// Formato de página vazia, usado quando não há resultados ou a requisição falha.
const PAGINA_VAZIA = { content: [], totalPages: 0, totalElements: 0, number: 0 };

// O back-end de histórico de estoque não pagina nem filtra os resultados
// (retorna a lista completa), então a busca, ordenação e paginação são
// feitas aqui no front para manter a mesma experiência das outras listas.
function filtrarOrdenarPaginar(historicos, { nome, page, size, direcao }) {
    const termo = nome?.trim().toLowerCase();

    let filtrados = historicos;
    if (termo) {
        filtrados = filtrados.filter((historico) =>
            historico.produto?.nome?.toLowerCase().includes(termo)
        );
    }

    const ordenados = [...filtrados].sort((a, b) => {
        const nomeA = a.produto?.nome?.toLowerCase() || '';
        const nomeB = b.produto?.nome?.toLowerCase() || '';
        const comparacao = nomeA.localeCompare(nomeB);
        return direcao === 'desc' ? -comparacao : comparacao;
    });

    const totalElements = ordenados.length;
    const totalPages = Math.max(1, Math.ceil(totalElements / size));
    const inicio = page * size;
    const content = ordenados.slice(inicio, inicio + size);

    return { content, totalPages, totalElements, number: page };
}

export async function listarHistoricoEstoque({ nome = "", page = 0, size = 10, direcao = "asc" } = {}) {
    try {
        const response = await api.get('/historico-estoque');

        if (response.status === 200) {
            return filtrarOrdenarPaginar(response.data || [], { nome, page, size, direcao });
        }
        if (response.status === 204) {
            return { ...PAGINA_VAZIA, number: page };
        }
        return { ...PAGINA_VAZIA, number: page };
    } catch (error) {
        console.error('Erro ao buscar histórico de estoque:', error);
        return { ...PAGINA_VAZIA, number: page };
    }
}

export async function buscarHistoricoEstoquePorId(id) {
    try {
        const response = await api.get(`/historico-estoque/${id}`);

        if (response.status === 200) return response.data;
        return null;
    } catch (error) {
        console.error('Erro ao buscar histórico de estoque:', error);
        return null;
    }
}

export async function deletarHistoricoEstoque(id) {
    try {
        const response = await api.delete(`/historico-estoque/${id}`);

        return response.status === 204;
    } catch (error) {
        console.error('Erro ao apagar histórico de estoque:', error);
        return false;
    }
}

function validarDadosHistoricoEstoque(historico, setFeedback) {
    if (!historico.produtoId) {
        setFeedback({ tipo: 'erro', msg: 'Selecione um produto.', loading: false });
        return false;
    }

    if (historico.quantidade === '' || historico.quantidade === null || historico.quantidade === undefined) {
        setFeedback({ tipo: 'erro', msg: 'Informe a quantidade em estoque.', loading: false });
        return false;
    }

    if (Number.isNaN(Number(historico.quantidade)) || Number(historico.quantidade) < 0) {
        setFeedback({ tipo: 'erro', msg: 'A quantidade precisa ser um número maior ou igual a zero.', loading: false });
        return false;
    }

    return true;
}

function montarPayloadHistoricoEstoque(historico) {
    return {
        quantidade: Number(historico.quantidade),
        idProduto: Number(historico.produtoId)
    };
}

export async function cadastrarHistoricoEstoque(historico, navigate, setFeedback) {

    if (!validarDadosHistoricoEstoque(historico, setFeedback)) return;

    setFeedback({ tipo: '', msg: 'Cadastrando estoque...', loading: true });

    const payload = montarPayloadHistoricoEstoque(historico);

    try {
        const response = await api.post('/historico-estoque', payload);

        if (response.status === 201) {
            setFeedback({ tipo: 'sucesso', msg: 'Estoque cadastrado com sucesso!', loading: false });
            setTimeout(() => navigate("/historico-estoque"), 2000);
        } else if (response.status === 404) {
            setFeedback({ tipo: 'erro', msg: 'Produto informado não foi encontrado. Nenhum dado foi salvo.', loading: false });
        } else if (response.status === 401) {
            setFeedback({ tipo: 'erro', msg: 'Ação não autorizada.', loading: false });
        } else if (response.status === 400) {
            setFeedback({ tipo: 'erro', msg: 'Dados inválidos. Verifique os campos e tente novamente.', loading: false });
        } else {
            setFeedback({ tipo: 'erro', msg: 'Não foi possível cadastrar o estoque. Nenhum dado foi salvo.', loading: false });
        }
    } catch {
        setFeedback({ tipo: 'erro', msg: 'Erro de conexão. Nenhum dado foi salvo.', loading: false });
    }
}

export async function atualizarHistoricoEstoque(id, historico, navigate, setFeedback) {

    if (!validarDadosHistoricoEstoque(historico, setFeedback)) return;

    setFeedback({ tipo: '', msg: 'Atualizando estoque...', loading: true });

    const payload = montarPayloadHistoricoEstoque(historico);

    try {
        const response = await api.put(`/historico-estoque/${id}`, payload);

        if (response.status === 200) {
            setFeedback({ tipo: 'sucesso', msg: 'Estoque atualizado com sucesso!', loading: false });
            setTimeout(() => navigate("/historico-estoque"), 2000);
        } else if (response.status === 404) {
            setFeedback({ tipo: 'erro', msg: 'Registro de estoque ou produto não encontrados.', loading: false });
        } else if (response.status === 401) {
            setFeedback({ tipo: 'erro', msg: 'Ação não autorizada.', loading: false });
        } else if (response.status === 400) {
            setFeedback({ tipo: 'erro', msg: 'Dados inválidos. Verifique os campos e tente novamente.', loading: false });
        } else {
            setFeedback({ tipo: 'erro', msg: 'Não foi possível atualizar o estoque.', loading: false });
        }
    } catch {
        setFeedback({ tipo: 'erro', msg: 'Erro de conexão. Nenhum dado foi salvo.', loading: false });
    }
}
