import api from "./apiClient";

const ACESSOS = {
    DASHBOARD: 1,
    FAMILIAS: 2,
    FUNCIONARIOS: 3,
};

const PERMISSOES = {
    ACESSAR: 1,
    CADASTRAR: 2,
    EDITAR: 3,
    EXCLUIR: 4,
};


export const PERMISSOES_CARGO = [
    { id: `${ACESSOS.DASHBOARD}:${PERMISSOES.ACESSAR}`, acessoId: ACESSOS.DASHBOARD, permissaoId: PERMISSOES.ACESSAR, nome: "Acessar a tela de dashboard e relatórios" },
    { id: `${ACESSOS.FAMILIAS}:${PERMISSOES.CADASTRAR}`, acessoId: ACESSOS.FAMILIAS, permissaoId: PERMISSOES.CADASTRAR, nome: "Cadastrar famílias" },
    { id: `${ACESSOS.FAMILIAS}:${PERMISSOES.EDITAR}`, acessoId: ACESSOS.FAMILIAS, permissaoId: PERMISSOES.EDITAR, nome: "Editar famílias" },
    { id: `${ACESSOS.FAMILIAS}:${PERMISSOES.EXCLUIR}`, acessoId: ACESSOS.FAMILIAS, permissaoId: PERMISSOES.EXCLUIR, nome: "Excluir famílias" },
    { id: `${ACESSOS.FUNCIONARIOS}:${PERMISSOES.CADASTRAR}`, acessoId: ACESSOS.FUNCIONARIOS, permissaoId: PERMISSOES.CADASTRAR, nome: "Cadastrar funcionários" },
    { id: `${ACESSOS.FUNCIONARIOS}:${PERMISSOES.EDITAR}`, acessoId: ACESSOS.FUNCIONARIOS, permissaoId: PERMISSOES.EDITAR, nome: "Editar funcionários" },
];

export async function buscarCargo() {
    try {
        const response = await api.get("/cargos");

        if (response.status === 200) {
            return response.data;
        }
        if (response.status === 204) {
            console.log("Cargo não encontrado");
            return [];
        }
        if (response.status === 401) {
            console.log("Não autorizado");
        }
        return null;
    } catch (error) {
        console.error("Erro:", error);
        return null;
    }
}

export async function listarCargos() {
    try {
        const response = await api.get("/cargos");

        if (response.status === 200) return response.data;
        return [];
    } catch (error) {
        console.error("Erro ao buscar cargos:", error);
        return [];
    }
}

export async function buscarCargoPorId(id) {
    try {
        const response = await api.get(`/cargos/${id}`);

        if (response.status === 200) return response.data;
        return null;
    } catch (error) {
        console.error("Erro ao buscar cargo:", error);
        return null;
    }
}

export async function deletarCargo(id) {
    try {
        const response = await api.delete(`/cargos/${id}`);

        return response.status === 204;
    } catch (error) {
        console.error("Erro ao apagar cargo:", error);
        return false;
    }
}

export async function listarCargosAcessos() {
    try {
        const response = await api.get("/cargos-acessos");

        if (response.status === 200) return response.data;
        return [];
    } catch (error) {
        console.error("Erro ao buscar acessos dos cargos:", error);
        return [];
    }
}

export async function cadastrarCargo(nome, idsPermissoesSelecionadas, navigate, setFeedback) {

    if (!nome.trim()) {
        setFeedback({ tipo: 'erro', msg: 'O nome do cargo é obrigatório.', loading: false });
        return;
    }

    setFeedback({ tipo: '', msg: 'Cadastrando cargo...', loading: true });

    try {
        const response = await api.post('/cargos', { nome });

        if (response.status !== 201) {
            if (response.status === 401) {
                setFeedback({ tipo: 'erro', msg: 'Ação não autorizada.', loading: false });
            } else {
                setFeedback({ tipo: 'erro', msg: 'Não foi possível cadastrar o cargo. Nenhum dado foi salvo.', loading: false });
            }
            return;
        }

        const novoCargoId = response.data.id;

        if (idsPermissoesSelecionadas.length > 0) {
            await Promise.allSettled(
                idsPermissoesSelecionadas.map((idCombinado) => {
                    const [acessoId, permissaoId] = idCombinado.split(':').map(Number);
                    return api.post('/cargos-acessos', { cargoId: novoCargoId, acessoId, permissaoId });
                })
            );
        }

        setFeedback({ tipo: 'sucesso', msg: 'Cargo cadastrado com sucesso!', loading: false });
        setTimeout(() => navigate("/cargos"), 2000);
    } catch {
        setFeedback({ tipo: 'erro', msg: 'Erro de conexão. Nenhum dado foi salvo.', loading: false });
    }
}


export async function atualizarCargo(id, nome, idsPermissoesSelecionadas, associacoesAtuais, navigate, setFeedback) {

    if (!nome.trim()) {
        setFeedback({ tipo: 'erro', msg: 'O nome do cargo é obrigatório.', loading: false });
        return;
    }

    setFeedback({ tipo: '', msg: 'Atualizando cargo...', loading: true });

    try {
        const response = await api.put(`/cargos/${id}`, { nome });

        if (response.status !== 200) {
            if (response.status === 404) {
                setFeedback({ tipo: 'erro', msg: 'Cargo não encontrado.', loading: false });
            } else if (response.status === 401) {
                setFeedback({ tipo: 'erro', msg: 'Ação não autorizada.', loading: false });
            } else {
                setFeedback({ tipo: 'erro', msg: 'Não foi possível atualizar o cargo.', loading: false });
            }
            return;
        }

        const idsAtuais = associacoesAtuais.map((a) => `${a.acessoId}:${a.permissaoId}`);

        const paraAdicionar = idsPermissoesSelecionadas.filter((idCombinado) => !idsAtuais.includes(idCombinado));
        const paraRemover = associacoesAtuais.filter(
            (a) => !idsPermissoesSelecionadas.includes(`${a.acessoId}:${a.permissaoId}`)
        );

        await Promise.allSettled([
            ...paraAdicionar.map((idCombinado) => {
                const [acessoId, permissaoId] = idCombinado.split(':').map(Number);
                return api.post('/cargos-acessos', { cargoId: Number(id), acessoId, permissaoId });
            }),
            ...paraRemover.map((a) => api.delete(`/cargos-acessos/${a.id}`)),
        ]);

        setFeedback({ tipo: 'sucesso', msg: 'Cargo atualizado com sucesso!', loading: false });
        setTimeout(() => navigate("/cargos"), 2000);
    } catch {
        setFeedback({ tipo: 'erro', msg: 'Erro de conexão. Nenhum dado foi salvo.', loading: false });
    }
}
