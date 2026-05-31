import styles from './Input.module.css'

function Input(props){
    return(
        <div className={styles.campo}>
            <p className={styles.nomeCampo}>{props.nomeCampo}</p>
            <input 
                type={props.tipo} 
                placeholder={props.mensagem} 
                className={styles.input} 
                value={props.value} 
                onChange={props.onChange}
            />
        </div>
    )
}

export default Input;