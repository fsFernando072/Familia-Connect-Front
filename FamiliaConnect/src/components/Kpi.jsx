import styles from './Kpi.module.css'

function Kpi(props){
    return(
        <div className={styles.kpi}>
            <h3 className={styles.titulo}>{props.titulo}</h3>
            <h2 className={styles.valor}>{props.valor}</h2>
            <h4 className={styles.descricao}>{props.descricao}</h4>
        </div>
    )
}

export default Kpi;