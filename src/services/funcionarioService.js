import api from "./apiClient";

export async function cadastrarFuncionario(nome, cpf, senha, senhaConfirmada, idCargo, foto, navigate, setFeedback) {

    if (!nome || !cpf || !senha || !senhaConfirmada || !idCargo) {
        setFeedback({ tipo: 'erro', msg: 'Os campos são obrigatórios', loading: false });
        return;
    }

    if (senha != senhaConfirmada) {
        setFeedback({ tipo: 'erro', msg: 'As senhas têm que ser iguais', loading: false });
        return;
    }

    setFeedback({ tipo: '', msg: 'Verificando...', loading: true });

    try {
        const response = await api.post('/funcionarios', { nome, cpf, senha, cargoId: idCargo });

        if (response.status === 201) {
            setFeedback({ tipo: 'sucesso', msg: 'Usuário cadastrado com sucesso!', loading: false });
            setTimeout(() => navigate("/pagina-inicial"), 2000);
        } else if (response.status === 404) {
            setFeedback({ tipo: 'erro', msg: 'Cargo não encontrado.', loading: false });
        } else if (response.status === 401) {
            setFeedback({ tipo: 'erro', msg: 'Ação não autorizada.', loading: false });
        }
    } catch {
        setFeedback({ tipo: 'erro', msg: 'Erro de conexão. Tente novamente.', loading: false });
    }
}
