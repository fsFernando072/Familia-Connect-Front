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

export function buscarCargo() {

    return fetch('http://localhost:8080/cargos', {
        method: 'GET',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json'
        },
    })
        .then((response) => {
            if (response.status == 200) {
                return response.json();
            } else if (response.status == 204) {
                console.log("Usuário não encontrado");
                return [];
            } else if (response.status == 401) {
                console.log("Não autorizado");
                return null;
            }
        })
        .then((data) => {
            if (!data) return null;
            console.log(data)
            return data;
        })
        .catch((error) => {
            console.error('Erro:', error);
        });
}

export const mascaraCpf = (valor) => {
    valor = valor.replace(/\D/g, "").slice(0, 11);

    valor = valor.replace(/(\d{3})(\d)/, "$1.$2");
    valor = valor.replace(/(\d{3})(\d)/, "$1.$2");
    valor = valor.replace(/(\d{3})(\d{1,2})$/, "$1-$2");

    return valor;
};