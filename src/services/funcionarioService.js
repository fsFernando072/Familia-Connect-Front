import api from "./apiClient";

export async function listarFuncionarios() {
    try {
        const response = await api.get('/funcionarios');

        if (response.status === 200) return response.data;
        return [];
    } catch (error) {
        console.error('Erro ao buscar funcionários:', error);
        return [];
    }
}

export async function buscarFuncionarioPorId(id) {
    try {
        const response = await api.get(`/funcionarios/${id}`);

        if (response.status === 200) return response.data;
        return null;
    } catch (error) {
        console.error('Erro ao buscar funcionário:', error);
        return null;
    }
}

export async function deletarFuncionario(id) {
    try {
        const response = await api.delete(`/funcionarios/${id}`);

        return response.status === 204;
    } catch (error) {
        console.error('Erro ao apagar funcionário:', error);
        return false;
    }
}

export async function cadastrarFuncionario(nome, cpf, senha, senhaConfirmada, idCargo, foto, navigate, setFeedback) {

    if (!nome || !cpf || !senha || !senhaConfirmada || !idCargo) {
        setFeedback({ tipo: 'erro', msg: 'Os campos são obrigatórios', loading: false });
        return;
    }

    if (senha.length < 8 || senhaConfirmada.length < 8) {
        setFeedback({ tipo: 'erro', msg: 'A senha deve ter no mínimo 8 caracteres', loading: false });
        return;
    }

    if (senha != senhaConfirmada) {
        setFeedback({ tipo: 'erro', msg: 'As senhas têm que ser iguais', loading: false });
        return;
    }

    setFeedback({ tipo: '', msg: 'Verificando...', loading: true });

    const payload = { nome, cpf, senha, cargoId: idCargo }

    const formData = new FormData();

    formData.append(
        "funcionarioRequestDto",
        new Blob(
            [JSON.stringify(payload)],
            { type: "application/json" }
        )
    );

    formData.append("arquivo", foto);

    try {
        const response = await api.post('/funcionarios', formData);

        if (response.status === 201) {
            setFeedback({ tipo: 'sucesso', msg: 'Funcionário cadastrado com sucesso!', loading: false });
            setTimeout(() => navigate("/funcionarios"), 2000);
        } else if (response.status === 404) {
            setFeedback({ tipo: 'erro', msg: 'Cargo não encontrado.', loading: false });
        } else if (response.status === 401) {
            setFeedback({ tipo: 'erro', msg: 'Ação não autorizada.', loading: false });
        } else {
            setFeedback({ tipo: 'erro', msg: 'Não foi possível cadastrar o funcionário.', loading: false });
        }
    } catch {
        setFeedback({ tipo: 'erro', msg: 'Erro de conexão. Tente novamente.', loading: false });
    }
}

export async function atualizarFuncionario(id, nome, cpf, senha, senhaConfirmada, idCargo, foto, navigate, setFeedback) {

    if (!nome || !cpf || !senha || !senhaConfirmada || !idCargo) {
        setFeedback({ tipo: 'erro', msg: 'Os campos são obrigatórios', loading: false });
        return;
    }

    if (senha.length < 8 || senhaConfirmada.length < 8) {
        setFeedback({ tipo: 'erro', msg: 'A senha deve ter no mínimo 8 caracteres', loading: false });
        return;
    }

    if (senha != senhaConfirmada) {
        setFeedback({ tipo: 'erro', msg: 'As senhas têm que ser iguais', loading: false });
        return;
    }

    setFeedback({ tipo: '', msg: 'Atualizando...', loading: true });

    const payload = { nome, cpf, senha, cargoId: idCargo }

    const formData = new FormData();

    formData.append(
        "funcionarioRequestDto",
        new Blob(
            [JSON.stringify(payload)],
            { type: "application/json" }
        )
    );

    formData.append("arquivo", foto);

    try {
        const response = await api.put(`/funcionarios/${id}`, formData);

        if (response.status === 200) {
            setFeedback({ tipo: 'sucesso', msg: 'Funcionário atualizado com sucesso!', loading: false });
            setTimeout(() => navigate("/funcionarios"), 2000);
        } else if (response.status === 404) {
            setFeedback({ tipo: 'erro', msg: 'Funcionário ou cargo não encontrado.', loading: false });
        } else if (response.status === 401) {
            setFeedback({ tipo: 'erro', msg: 'Ação não autorizada.', loading: false });
        } else {
            setFeedback({ tipo: 'erro', msg: 'Não foi possível atualizar o funcionário.', loading: false });
        }
    } catch {
        setFeedback({ tipo: 'erro', msg: 'Erro de conexão. Tente novamente.', loading: false });
    }
}
