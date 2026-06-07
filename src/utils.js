export function cadastrarFuncionario(nome, cpf, senha, senhaConfirmada, idCargo, foto, navigate) {

    console.log(nome)
    console.log(cpf)
    console.log(senha)
    console.log(senhaConfirmada)
    console.log(idCargo)
    console.log(foto)

    if (!nome || !cpf || !senha || !senhaConfirmada || !idCargo || !foto) {
        console.error("Todos os campos são obrigatórios");
        return;
    }

    if (senha != senhaConfirmada) {
        console.error("As senhas têm que ser iguais");
        return;
    }

    fetch('http://localhost:8080/funcionarios', {
        method: 'POST',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            nome: nome,
            cpf: cpf,
            senha: senha,
            idCargo: idCargo,
            fotoFuncionario: foto
        })
    })
        .then((response) => {
            if (response.status === 201) {
                return response.json();
            } else if (response.status === 404) {
                throw new Error("Cargo não encontrado pelo ID");
            } else if (response.status == 401) {
                throw new Error("Não autorizado")
            } else {
                throw new Error("Erro na autenticação");
            }
        })
        .then((data) => {
            console.log('Sucesso:', data);

            setTimeout(() => {
                navigate("/dashboard");
            }, 2000);
        })
        .catch((error) => {
            console.error('Erro:', error.message);
        });
}

export function entrar(cpf, senha, navigate) {

    if (!cpf || !senha) {
        console.error("CPF e Senha são obrigatórios");
        return;
    }

    fetch('http://localhost:8080/funcionarios/login', {
        method: 'POST',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            cpf: cpf,
            senha: senha
        })
    })
        .then((response) => {
            if (response.status === 200) {
                return response.json();
            } else if (response.status === 404) {
                throw new Error("Usuário não encontrado");
            } else {
                throw new Error("Erro na autenticação");
            }
        })
        .then((data) => {
            console.log('Sucesso:', data);

            setTimeout(() => {
                navigate("/cadastro");
            }, 2000);
        })
        .catch((error) => {
            console.error('Erro:', error.message);
        });
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