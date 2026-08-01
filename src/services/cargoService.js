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
