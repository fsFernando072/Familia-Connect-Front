import styles from "./Botao.module.css"

function Botao(props) {

    return (
        <div
            className={styles.botao}
            style={{ backgroundColor: props.cor }}
            onClick={props.acao}
        >
            <h1>{props.nome}</h1>
        </div>
    )
}

export default Botao