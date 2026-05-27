import { Link, useNavigate } from "react-router-dom";
import Mensagem from "../../components/Mensagem";

function Entrar() {

    // Definir essas variáveis como useState
    const cpf = document.getElementById('cpf').value
    const senha = document.getElementById('senha').value
    const navigate = useNavigate();

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
        .then((response) => {

            if (response.status == 200) {
                return response.json()

            } else if (response.status == 404) {
                console.log("Usuário não encontrado")
            }

        })
        .then((data) => {
            console.log('Sucesso:', data)

            <Mensagem/>

            setTimeout(() => {
                navigate("/cadastro")
            }, 2000)
        })
        .catch((error) => {
            console.error('Erro:', error)
        });


}

export default Entrar;