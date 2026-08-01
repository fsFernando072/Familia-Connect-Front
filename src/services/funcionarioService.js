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
        const response = await fetch('http://localhost:8080/funcionarios', {
            method: 'POST',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ nome: nome, cpf: cpf, senha: senha, cargoId: idCargo })
        });

        if (response.status === 201) {
            setFeedback({ tipo: 'sucesso', msg: 'Usuário cadastrado com sucesso!', loading: false });
            setTimeout(() => navigate("/"), 2000);
        } else if (response.status === 404) {
            setFeedback({ tipo: 'erro', msg: 'Cargo não encontrado.', loading: false });
        } else if(response.status === 401){
            setFeedback({ tipo: 'erro', msg: 'Ação não autorizada.', loading: false });
        }
    } catch {
        setFeedback({ tipo: 'erro', msg: 'Erro de conexão. Tente novamente.', loading: false });
    }
}
