import styles from "./Botao.module.css"

function Botao(props) {
    return (
        <div className={styles.botao} style={{ backgroundColor: props.cor }}>
            <h1 onClick={entrar}>{props.nome}</h1>
        </div>
    )

    function entrar() {

        const cpf = document.getElementById('cpf').value
        const senha = document.getElementById('senha').value

        fetch('http://localhost:8080/funcionarios/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                cpf : cpf,
                senha : senha 
            })
        })
            .then(response => response.json())
            .then(data => console.log('Sucesso:', data))
            .catch(error => console.error('Erro:', error));
    }
}

export default Botao