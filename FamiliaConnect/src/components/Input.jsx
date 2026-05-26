import styles from './Input.module.css'

function Input(props){
    return(
        <div className={styles.campo}>
            <p className={styles.nomeCampo}>{props.nomeCampo}</p>
            <input type={props.tipo} placeholder={props.mensagem} className={styles.input} id={props.id}/>
        </div>
    )
}

export default Input;