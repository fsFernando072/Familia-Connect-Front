import { Pie } from "react-chartjs-2";
import "chart.js/auto";
import styles from "./GraficoDePizza.module.css"

function GraficoDePizza() {
  return (
    <div className={styles.GraficoDePizza}>
      <Pie
        data={{
          labels: ["A", "B", "C"],
          datasets: [
            {
              label: "Revenue",
              data: [200, 300, 400],
              backgroundColor: ["pink", "purple", "aquamarine"]
            },
          ]
        }}
      />
    </div>
  );
}

export default GraficoDePizza;