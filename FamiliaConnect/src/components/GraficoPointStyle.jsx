import { Line } from "react-chartjs-2";
import "chart.js/auto";
import styles from "./GraficoDeLinha.module.css";

function GraficoPointStyle() {
  return (
    <div className={styles.graficoDeLinha}>
      <Line
        data={{
          labels: ["Jan", "Fev", "Mar"],
          datasets: [
            {
              label: "Revenue",
              data: [9, 5, 16],
              borderColor: "purple",
              pointStyle: "circle",
              pointRadius: 8,
              pointBackgroundColor: "purple"
            },
          ]
        }}
      />
    </div>
  );
}

export default GraficoPointStyle;