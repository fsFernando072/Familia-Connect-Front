export async function entrar(cpf, senha, navigate, setFeedback) {

    if (!cpf || !senha) {
        setFeedback({ tipo: 'erro', msg: 'CPF e senha são obrigatórios.', loading: false });
        return;
    }

    setFeedback({ tipo: '', msg: 'Verificando...', loading: true });

    try {
        const response = await fetch('http://localhost:8080/funcionarios/login', {
            method: 'POST',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ cpf, senha })
        });

        if (response.status === 200) {
            setFeedback({ tipo: 'sucesso', msg: 'Login realizado! Entrando...', loading: false });
            setTimeout(() => navigate("/cadastro"), 2000);
        } else if (response.status === 404) {
            setFeedback({ tipo: 'erro', msg: 'Usuário não encontrado.', loading: false });
        } else {
            setFeedback({ tipo: 'erro', msg: 'Erro na autenticação.', loading: false });
        }
    } catch {
        setFeedback({ tipo: 'erro', msg: 'Erro de conexão. Tente novamente.', loading: false });
    }
}
