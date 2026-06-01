import GraficoDeLinha from "../../components/GraficoLinha";
import GraficoDePizza from "../../components/GraficoDePizza";
import Kpi from "../../components/Kpi";
import GraficoPointStyle from "../../components/GraficoPointStyle";
import styles from './Dashboard.module.css'

function Dashboard() {
  return (
    <div className={styles.dashboard}>
      <div className={styles.kpi}>
        <Kpi titulo="% de Famílias Atendidas no Mês" valor="80%" descricao="100 famílias cadastradas - 80 atendidas" />
        <Kpi titulo="Famílias Ativas" valor="83" descricao="Famílias ativas há mais de 3 meses" />
        <Kpi titulo="Famílias Novas" valor="5" descricao="Famílias cadastradas esse mês" />
      </div>
      <div className={styles.meio}>
        <GraficoDeLinha />
        <GraficoDeLinha />
      </div>
      <div className={styles.fim}>
        <GraficoDePizza />
        <GraficoPointStyle /> 
      </div>
    </div>
  );
}

export default Dashboard;