function entrar() {

    console.log("entrei aq")

    const cpf = document.getElementById('cpf').value
    const senha = document.getElementById('senha').value

    fetch('http://localhost:8080/funcionarios/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            cpf: cpf,
            senha: senha
        })
    })
        .then(response => response.json())
        .then(data => console.log('Sucesso:', data))
        .catch(error => console.error('Erro:', error));
}

export default entrar;