import { Bar } from "react-chartjs-2";
import "chart.js/auto";
import styles from './GraficoDeLinha.module.css'

function GraficoDeLinha() {
  return (
    <div className={styles.graficoDeLinha}>
      <Bar
        data={{
          labels: ["A", "B", "C"],
          datasets: [
            {
              label: "Revenue",
              data: [200, 300, 400],
              backgroundColor: ["pink", "purple", "aquamarine"]
            },
            {
              label: "Loss",
              data: [90, 80, 70],
              backgroundColor: ["red", "green", "blue"]
            }
          ]
        }}
      />
    </div>

  );
}

export default GraficoDeLinha;